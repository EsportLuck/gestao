import { prisma } from "@/services/prisma";

export class CompaniesController {
  async create() {
    try {
      const companies = await prisma.companies.findMany();
      if (!companies.length) {
        await prisma.companies.create({
          data: {
            id: 1,
          },
        });
      }
      return true;
    } catch (error) {
      console.error("CompaniesController Create");
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}
