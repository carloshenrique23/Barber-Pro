import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BARBERSHOP_ID = 1;

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const existingService = await prisma.service.findFirst({
      where: {
        id: Number(id),
        barbershopId: BARBERSHOP_ID,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: "Serviço não encontrado." },
        { status: 404 }
      );
    }

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
    console.error("Erro ao atualizar serviço:", error);

    return NextResponse.json(
      { message: "Erro ao atualizar serviço." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const existingService = await prisma.service.findFirst({
      where: {
        id: Number(id),
        barbershopId: BARBERSHOP_ID,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: "Serviço não encontrado." },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Serviço excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);

    return NextResponse.json(
      { message: "Erro ao excluir serviço." },
      { status: 500 }
    );
  }
}