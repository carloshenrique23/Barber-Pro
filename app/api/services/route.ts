import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BARBERSHOP_ID = 1;

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        barbershopId: BARBERSHOP_ID,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);

    return NextResponse.json(
      { message: "Erro ao buscar serviços." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { message: "Nome e preço são obrigatórios." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
  data: {
    name: body.name.trim(),
    price: Number(body.price),
    active: true,
    barbershopId: BARBERSHOP_ID,
  },
});

    return NextResponse.json(service, {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);

    return NextResponse.json(
      { message: "Erro ao criar serviço." },
      { status: 500 }
    );
  }
}