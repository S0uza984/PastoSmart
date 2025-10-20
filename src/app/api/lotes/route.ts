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

    const lotes = await prisma.lote.findMany({
      include: {
        bois: true,
        _count: {
          select: {
            bois: true
          }
        }
      },
      orderBy: {
        chegada: 'desc'
      }
    });

    // Calcular estatísticas para cada lote
    const lotesComEstatisticas = lotes.map((lote: any) => {
      const pesoTotal = lote.bois.reduce((acc: number, boi: any) => acc + boi.peso, 0);
      const pesoMedio = lote.bois.length > 0 ? pesoTotal / lote.bois.length : 0;
      
      return {
        id: lote.id,
        codigo: lote.codigo,
        chegada: lote.chegada,
        custo: lote.custo,
        data_venda: lote.data_venda,
        vacinado: lote.vacinado,
        data_vacinacao: lote.data_vacinacao,
        quantidadeBois: lote._count.bois,
        pesoMedio: pesoMedio,
        pesoTotal: pesoTotal
      };
    });

    return NextResponse.json(lotesComEstatisticas, { status: 200 });
  } catch (err: any) {
    console.error("API /api/lotes GET error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
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
    const { codigo, chegada, custo, vacinado, data_vacinacao } = body || {};

    if (!codigo || !chegada || !custo) {
      return NextResponse.json({ message: "Código, data de chegada e custo são obrigatórios" }, { status: 400 });
    }

    const lote = await prisma.lote.create({
      data: {
        codigo,
        chegada: new Date(chegada),
        custo: parseFloat(custo),
        vacinado: Boolean(vacinado),
        data_vacinacao: data_vacinacao ? new Date(data_vacinacao) : null
      },
      include: {
        bois: true,
        _count: {
          select: {
            bois: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Lote criado com sucesso", 
      lote: {
        id: lote.id,
        codigo: lote.codigo,
        chegada: lote.chegada,
        custo: lote.custo,
        vacinado: lote.vacinado,
        data_vacinacao: lote.data_vacinacao,
        quantidadeBois: lote._count.bois
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error("API /api/lotes POST error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}
