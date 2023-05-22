import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const teamName = req.body.teamName;
  const game = "" + req.body.gameName;
  const marker = req.body.marker;

  const markerString = marker[0] + "," + marker[1];

  try {
    const result = await prisma.Answer.create({
      data: {
        name: teamName,
        coordinates: markerString,
        game: game,
      },
    });

    res.json({ answer: result, error: null });
  } catch (error) {
    res.json({ error: error.message, answer: null });
  }
}
