import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    await prisma.blockedSlot.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Bloqueio removido com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao remover bloqueio." },
      { status: 500 }
    );
  }
}