import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BARBERSHOP_ID = 1;

export async function GET() {
  try {
    const blocks = await prisma.blockedSlot.findMany({
      where: {
        barbershopId: BARBERSHOP_ID,
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          time: "asc",
        },
      ],
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Erro ao buscar bloqueios:", error);

    return NextResponse.json(
      { message: "Erro ao buscar bloqueios." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.date) {
      return NextResponse.json(
        { message: "Informe uma data." },
        { status: 400 }
      );
    }

    const blockDate = new Date(`${body.date}T12:00:00`);

    if (isNaN(blockDate.getTime())) {
      return NextResponse.json(
        { message: "Data inválida." },
        { status: 400 }
      );
    }

    const block = await prisma.blockedSlot.create({
      data: {
        date: blockDate,
        time: body.time || null,
        reason: body.reason?.trim() || null,
        barbershopId: BARBERSHOP_ID,
      },
    });

    return NextResponse.json(block, {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar bloqueio:", error);

    return NextResponse.json(
      { message: "Erro ao criar bloqueio." },
      { status: 500 }
    );
  }
}