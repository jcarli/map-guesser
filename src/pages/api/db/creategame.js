import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const name = req.body.name;
  const zoom = "" + req.body.zoom;
  const center = req.body.center;
  const marker = req.body.marker;

  const centerString = center[0] + "," + center[1];
  const markerString = marker[0] + "," + marker[1];

  try {
    const result = await prisma.Game.create({
      data: {
        name: name,
        zoom: zoom,
        center: centerString,
        marker: markerString,
      },
    });

    res.json({ game: result, error: null });
  } catch (error) {
    res.json({ error: error.message, game: null });
  }
}
