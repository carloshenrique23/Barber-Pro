import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: [
        {
          date: "asc",
        },
        {
          time: "asc",
        },
      ],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);

    return NextResponse.json(
      { message: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}