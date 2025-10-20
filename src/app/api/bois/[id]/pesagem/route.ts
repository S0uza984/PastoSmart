import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // importa o Prisma Client dinamicamente
    const mod = await import("../../../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    // singleton para hot-reload em dev
    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const boiId = parseInt(params.id);

    if (isNaN(boiId)) {
      return NextResponse.json({ message: "ID do boi inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { peso, dataPesagem } = body || {};

    if (!peso || isNaN(parseFloat(peso)) || parseFloat(peso) <= 0) {
      return NextResponse.json({ message: "Peso deve ser um número positivo" }, { status: 400 });
    }

    // Verificar se o boi existe e buscar o loteId
    const boi = await prisma.boi.findUnique({
      where: { id: boiId },
      include: { Lote: true }
    });

    if (!boi) {
      return NextResponse.json({ message: "Boi não encontrado" }, { status: 404 });
    }

    // Criar registro no histórico de peso
    const pesagem = await prisma.pesoHistorico.create({
      data: {
        peso: parseFloat(peso),
        dataPesagem: dataPesagem ? new Date(dataPesagem) : new Date(),
        boiId: boiId,
        loteId: boi.loteId
      }
    });

    // Atualizar o peso atual do boi
    await prisma.boi.update({
      where: { id: boiId },
      data: { peso: parseFloat(peso) }
    });

    return NextResponse.json({ 
      message: "Pesagem registrada com sucesso",
      pesagem: {
        id: pesagem.id,
        peso: pesagem.peso,
        dataPesagem: pesagem.dataPesagem
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error("API /api/bois/[id]/pesagem POST error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // importa o Prisma Client dinamicamente
    const mod = await import("../../../../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    // singleton para hot-reload em dev
    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const boiId = parseInt(params.id);

    if (isNaN(boiId)) {
      return NextResponse.json({ message: "ID do boi inválido" }, { status: 400 });
    }

    // Buscar histórico de pesagens do boi
    const historico = await prisma.pesoHistorico.findMany({
      where: { boiId: boiId },
      orderBy: { dataPesagem: 'asc' }
    });

    // Buscar informações do boi
    const boi = await prisma.boi.findUnique({
      where: { id: boiId },
      include: { Lote: true }
    });

    if (!boi) {
      return NextResponse.json({ message: "Boi não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      boi: {
        id: boi.id,
        peso: boi.peso,
        status: boi.status,
        alerta: boi.alerta,
        lote: {
          id: boi.Lote.id,
          codigo: boi.Lote.codigo
        }
      },
      historico: historico.map(p => ({
        id: p.id,
        peso: p.peso,
        dataPesagem: p.dataPesagem
      }))
    }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/bois/[id]/pesagem GET error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}
