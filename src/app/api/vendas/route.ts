import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // importa o Prisma Client dinamicamente
    const mod = await import("../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    // singleton para hot-reload em dev
    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    // Buscar todas as vendas com informações do lote
    const vendas = await prisma.venda.findMany({
      include: {
        Lote: {
          select: {
            id: true,
            codigo: true,
            chegada: true,
            custo: true,
            vacinado: true,
            data_vacinacao: true,
            _count: {
              select: {
                bois: true
              }
            }
          }
        }
      },
      orderBy: {
        dataVenda: 'desc'
      }
    });

    // Formatar resposta
    const vendasFormatadas = vendas.map((venda: any) => ({
      id: venda.id,
      dataVenda: venda.dataVenda,
      valor: venda.valor,
      loteId: venda.loteId,
      lote: {
        id: venda.Lote.id,
        codigo: venda.Lote.codigo,
        chegada: venda.Lote.chegada,
        custo: venda.Lote.custo,
        vacinado: venda.Lote.vacinado,
        quantidadeBois: venda.Lote._count.bois
      },
      lucro: venda.valor - venda.Lote.custo,
      margemLucro: ((venda.valor - venda.Lote.custo) / venda.Lote.custo * 100).toFixed(2)
    }));

    return NextResponse.json(vendasFormatadas, { status: 200 });
  } catch (err: any) {
    console.error("API /api/vendas GET error:", err);
    return NextResponse.json({ message: err?.message || "Erro ao buscar vendas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // importa o Prisma Client dinamicamente
    const mod = await import("../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    // singleton para hot-reload em dev
    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const body = await req.json();
    const { loteId, dataVenda, valor } = body || {};

    // Validações
    if (!loteId || !valor) {
      return NextResponse.json(
        { message: "Lote e valor são obrigatórios" },
        { status: 400 }
      );
    }

    if (valor <= 0) {
      return NextResponse.json(
        { message: "Valor deve ser maior que zero" },
        { status: 400 }
      );
    }

    // Verificar se lote existe
    const loteExistente = await prisma.lote.findUnique({
      where: { id: parseInt(loteId) },
      include: {
        _count: {
          select: {
            bois: true
          }
        }
      }
    });

    if (!loteExistente) {
      return NextResponse.json(
        { message: "Lote não encontrado" },
        { status: 404 }
      );
    }

    if (loteExistente.data_venda) {
      return NextResponse.json(
        { message: "Este lote já foi vendido" },
        { status: 400 }
      );
    }

    // Criar venda
    const venda = await prisma.venda.create({
      data: {
        loteId: parseInt(loteId),
        dataVenda: dataVenda ? new Date(dataVenda) : new Date(),
        valor: parseFloat(valor)
      }
    });

    // Atualizar data_venda do lote
    await prisma.lote.update({
      where: { id: parseInt(loteId) },
      data: {
        data_venda: new Date(venda.dataVenda)
      }
    });

    // Retornar venda com informações completas
    const vendaComDetalhes = {
      id: venda.id,
      dataVenda: venda.dataVenda,
      valor: venda.valor,
      loteId: venda.loteId,
      lote: {
        id: loteExistente.id,
        codigo: loteExistente.codigo,
        chegada: loteExistente.chegada,
        custo: loteExistente.custo,
        vacinado: loteExistente.vacinado,
        quantidadeBois: loteExistente._count.bois
      },
      lucro: venda.valor - loteExistente.custo,
      margemLucro: ((venda.valor - loteExistente.custo) / loteExistente.custo * 100).toFixed(2)
    };

    return NextResponse.json(
      {
        message: "Venda registrada com sucesso",
        venda: vendaComDetalhes
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API /api/vendas POST error:", err);
    return NextResponse.json(
      { message: err?.message || "Erro ao registrar venda" },
      { status: 500 }
    );
  }
}
