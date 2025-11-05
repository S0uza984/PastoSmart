import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // importa o Prisma Client dinamicamente
    const mod = await import("../../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    // singleton para hot-reload em dev
    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const { id } = await params;
    const loteId = parseInt(id);

    if (isNaN(loteId)) {
      return NextResponse.json({ message: "ID do lote inválido" }, { status: 400 });
    }

    const lote = await prisma.lote.findUnique({
      where: { id: loteId },
      include: {
        bois: {
          orderBy: {
            id: 'asc'
          }
        },
        _count: {
          select: {
            bois: true
          }
        }
      }
    });

    if (!lote) {
      return NextResponse.json({ message: "Lote não encontrado" }, { status: 404 });
    }

    // Calcular estatísticas do lote
    const pesoTotal = lote.bois.reduce((acc: number, boi: { peso: number }) => acc + boi.peso, 0);
    const pesoMedio = lote.bois.length > 0 ? pesoTotal / lote.bois.length : 0;
    
    const loteComEstatisticas = {
      id: lote.id,
      codigo: lote.codigo,
      chegada: lote.chegada,
      custo: lote.custo,
      data_venda: lote.data_venda,
      vacinado: lote.vacinado,
      data_vacinacao: lote.data_vacinacao,
      quantidadeBois: lote._count.bois,
      pesoMedio: pesoMedio,
      pesoTotal: pesoTotal,
      bois: lote.bois.map((boi: { id: number; peso: number; status: string; alerta: string | null }) => ({
        id: boi.id,
        peso: boi.peso,
        status: boi.status,
        alerta: boi.alerta
      }))
    };

    return NextResponse.json(loteComEstatisticas, { status: 200 });
  } catch (err: any) {
    console.error("API /api/lotes/[id] GET error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mod = await import("../../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const _params = await params;
    const loteId = parseInt(_params.id);
    if (isNaN(loteId)) {
      return NextResponse.json({ message: "ID do lote inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { codigo, chegada, custo, vacinado, data_vacinacao } = body || {};

    // Monta objeto de dados apenas com campos fornecidos
    const data: any = {};
    if (typeof codigo !== 'undefined') data.codigo = codigo;
    if (typeof chegada !== 'undefined') data.chegada = new Date(chegada);
    if (typeof custo !== 'undefined') data.custo = parseFloat(custo);
    if (typeof vacinado !== 'undefined') data.vacinado = Boolean(vacinado);
    if (typeof data_vacinacao !== 'undefined') data.data_vacinacao = data_vacinacao ? new Date(data_vacinacao) : null;

    const updated = await prisma.lote.update({
      where: { id: loteId },
      data
    });

    return NextResponse.json({ message: 'Lote atualizado com sucesso', lote: updated }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/lotes/[id] PUT error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}