import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BARBERSHOP_ID = 1;

export async function GET() {
  try {
    let settings = await prisma.barberSettings.findUnique({
      where: {
        barbershopId: BARBERSHOP_ID,
      },
    });

    if (!settings) {
      settings = await prisma.barberSettings.create({
        data: {
          name: "Barber Pro",
          whatsapp: "",
          address: "",
          instagram: "",
          openingHours: "Segunda a Sábado - 08:00 às 19:00",
          barbershopId: BARBERSHOP_ID,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);

    return NextResponse.json(
      { message: "Erro ao buscar configurações." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.barberSettings.upsert({
      where: {
        barbershopId: BARBERSHOP_ID,
      },

      update: {
        name: body.name,
        whatsapp: body.whatsapp,
        address: body.address,
        instagram: body.instagram,
        openingHours: body.openingHours,
      },

      create: {
        name: body.name || "Barber Pro",
        whatsapp: body.whatsapp || "",
        address: body.address || "",
        instagram: body.instagram || "",
        openingHours:
          body.openingHours ||
          "Segunda a Sábado - 08:00 às 19:00",
        barbershopId: BARBERSHOP_ID,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);

    return NextResponse.json(
      { message: "Erro ao salvar configurações." },
      { status: 500 }
    );
  }
}