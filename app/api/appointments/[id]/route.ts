import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const status = body.status;

    if (!["PENDENTE", "CONFIRMADO", "CANCELADO"].includes(status)) {
      return NextResponse.json(
        { message: "Status inválido." },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);

    return NextResponse.json(
      { message: "Erro ao atualizar agendamento." },
      { status: 500 }
    );
  }
}