const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const barbershop = await prisma.barbershop.upsert({
    where: {
      slug: "barber-pro",
    },
    update: {},
    create: {
      name: "Barber Pro",
      slug: "barber-pro",
    },
  });

  console.log("Barbearia:", barbershop);

  const appointments = await prisma.appointment.updateMany({
    where: {
      barbershopId: null,
    },
    data: {
      barbershopId: barbershop.id,
    },
  });

  const services = await prisma.service.updateMany({
    where: {
      barbershopId: null,
    },
    data: {
      barbershopId: barbershop.id,
    },
  });

  const blockedSlots = await prisma.blockedSlot.updateMany({
    where: {
      barbershopId: null,
    },
    data: {
      barbershopId: barbershop.id,
    },
  });

  const settings = await prisma.barberSettings.updateMany({
    where: {
      barbershopId: null,
    },
    data: {
      barbershopId: barbershop.id,
    },
  });

  console.log("Dados associados com sucesso:");
  console.log({
    appointments: appointments.count,
    services: services.count,
    blockedSlots: blockedSlots.count,
    settings: settings.count,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });