import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let settings = await prisma.barberSettings.findUnique({
      where: {
        id: 1,
      },
    });

    if (!settings) {
      settings = await prisma.barberSettings.create({
        data: {
          id: 1,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);

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
        id: 1,
      },

      update: {
        name: body.name,
        whatsapp: body.whatsapp,
        address: body.address,
        instagram: body.instagram,
        openingHours: body.openingHours,
      },

      create: {
        id: 1,
        name: body.name,
        whatsapp: body.whatsapp,
        address: body.address,
        instagram: body.instagram,
        openingHours: body.openingHours,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao salvar configurações." },
      { status: 500 }
    );
  }
}