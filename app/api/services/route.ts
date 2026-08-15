import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(error);

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
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao criar serviço." },
      { status: 500 }
    );
  }
}
export const dynamic = "force-static";
export const revalidate = 60;