import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BARBERSHOP_ID = 1;

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const block = await prisma.blockedSlot.findFirst({
      where: {
        id: Number(id),
        barbershopId: BARBERSHOP_ID,
      },
    });

    if (!block) {
      return NextResponse.json(
        { message: "Bloqueio não encontrado." },
        { status: 404 }
      );
    }

    await prisma.blockedSlot.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Bloqueio removido com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover bloqueio:", error);

    return NextResponse.json(
      { message: "Erro ao remover bloqueio." },
      { status: 500 }
    );
  }
}