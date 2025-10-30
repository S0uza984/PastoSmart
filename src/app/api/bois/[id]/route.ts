import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    const boiId = parseInt(_params.id);
    if (isNaN(boiId)) {
      return NextResponse.json({ message: "ID do boi inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { peso, status, alerta } = body || {};

    const data: any = {};
    if (typeof peso !== 'undefined') data.peso = parseFloat(peso);
    if (typeof status !== 'undefined') data.status = status;
    if (typeof alerta !== 'undefined') data.alerta = alerta ?? null;

    const updated = await prisma.boi.update({
      where: { id: boiId },
      data
    });

    // Se peso foi atualizado, sincroniza a última entrada de histórico de peso
    if (Object.prototype.hasOwnProperty.call(data, 'peso')) {
      const latest = await prisma.pesoHistorico.findFirst({
        where: { boiId },
        orderBy: { dataPesagem: 'desc' }
      });

      if (latest) {
        await prisma.pesoHistorico.update({
          where: { id: latest.id },
          data: {
            peso: updated.peso
          }
        });
      } else {
        // Caso não exista histórico (edge case), cria um
        await prisma.pesoHistorico.create({
          data: {
            peso: updated.peso,
            dataPesagem: new Date(),
            boiId: updated.id,
            loteId: (updated as any).loteId
          }
        });
      }
    }

    return NextResponse.json({ message: 'Boi atualizado com sucesso', boi: updated }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/bois/[id] PUT error:", err);
    return NextResponse.json({ message: err?.message || "Erro no servidor" }, { status: 500 });
  }
}


