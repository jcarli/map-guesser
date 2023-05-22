import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const name = req.query.name;

  const result = await prisma.Game.findUnique({
    where: {
      name: String(name),
    },
  });
  return res.json({ game: result });
}
