import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const tags = await prisma.tag.findMany();
  res.json(tags);
}
