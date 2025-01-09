import { prisma } from "@/services/prisma";

export const findUser = async (user: string) => {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        username: user,
      },
    });
    return findUser;
  } catch (error) {
    console.error("find findUser findUser", error);
  }
};
