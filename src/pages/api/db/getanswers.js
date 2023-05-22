import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const name = req.query.name;

  const result = await prisma.Answer.findMany({
    where: {
      game: String(name),
    },
  });
  return res.json({ answers: result });
}
