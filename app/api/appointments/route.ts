import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { message: "Data não informada." },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(`${date}T12:00:00`);

    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { message: "Data inválida." },
        { status: 400 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        date: appointmentDate,
        status: {
          not: "CANCELADO",
        },
      },
      select: {
        time: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Erro ao buscar horários:", error);

    return NextResponse.json(
      { message: "Erro ao buscar horários." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.name ||
      !body.phone ||
      !body.service ||
      !body.date ||
      !body.time
    ) {
      return NextResponse.json(
        { message: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(`${body.date}T12:00:00`);

    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { message: "Data inválida." },
        { status: 400 }
      );
    }

    // Verifica se o dia inteiro está bloqueado
    const blockedDay = await prisma.blockedSlot.findFirst({
      where: {
        date: appointmentDate,
        time: null,
      },
    });

    if (blockedDay) {
      return NextResponse.json(
        {
          message:
            blockedDay.reason ||
            "Esta data está bloqueada e não aceita agendamentos.",
        },
        { status: 409 }
      );
    }

    // Verifica se o horário específico está bloqueado
    const blockedTime = await prisma.blockedSlot.findFirst({
      where: {
        date: appointmentDate,
        time: body.time,
      },
    });

    if (blockedTime) {
      return NextResponse.json(
        {
          message:
            blockedTime.reason ||
            "Este horário está bloqueado e não está disponível.",
        },
        { status: 409 }
      );
    }

    // Busca o serviço e o preço atual
    const service = await prisma.service.findFirst({
      where: {
        name: body.service,
        active: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: "Serviço não encontrado." },
        { status: 400 }
      );
    }

    // Verifica se já existe outro agendamento
    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          date: appointmentDate,
          time: body.time,
          status: {
            not: "CANCELADO",
          },
        },
      });

    if (existingAppointment) {
      return NextResponse.json(
        { message: "Este horário já está ocupado." },
        { status: 409 }
      );
    }

    // Cria o agendamento
    const appointment = await prisma.appointment.create({
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        service: service.name,
        price: service.price,
        date: appointmentDate,
        time: body.time,
        status: "PENDENTE",
      },
    });

    return NextResponse.json(appointment, {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);

    return NextResponse.json(
      { message: "Erro interno ao salvar agendamento." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID do agendamento não informado." },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELADO",
      },
    });

    return NextResponse.json({
      message: "Agendamento cancelado com sucesso.",
      appointment,
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);

    return NextResponse.json(
      { message: "Erro ao cancelar agendamento." },
      { status: 500 }
    );
  }
}