import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const service = await prisma.service.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name.trim(),
        price: Number(body.price),
        active: body.active,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao atualizar serviço." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.service.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Serviço excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao excluir serviço." },
      { status: 500 }
    );
  }
}