import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blocks = await prisma.blockedSlot.findMany({
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
    console.error(error);

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

    const block = await prisma.blockedSlot.create({
      data: {
        date: blockDate,
        time: body.time || null,
        reason: body.reason?.trim() || null,
      },
    });

    return NextResponse.json(block, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao criar bloqueio." },
      { status: 500 }
    );
  }
}