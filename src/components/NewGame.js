import Button from "@/components/Button";
import MapDisplay from "@/components/MapDisplay";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const NewGame = () => {
  const router = useRouter();
  const [game, setGame] = useState(undefined);
  const [mapData, setMapData] = useState({
    zoom: undefined,
    center: undefined,
    marker: undefined,
  });

  const createGame = (mapValues) => {
    setMapData(mapValues);
  };

  const generateRandomId = () => {
    let result = "";
    let length = 5;
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let name = generateRandomId();
    let zoom = mapData.zoom;
    let center = mapData.center;
    let marker = mapData.marker;

    let gameRef = { name, zoom, center, marker };

    setGame(gameRef);
    await axios.post("/api/db/creategame", gameRef);
    await router.push({
      pathname: "/admin/[id]",
      query: { id: name },
    });
  };

  return (
    <div className="container">
      <MapDisplay
        startZoom={mapData.zoom === undefined ? 0 : mapData.zoom}
        startCenter={mapData.center === undefined ? [0, 0] : mapData.center}
        createGame={createGame}
        hideInformation={false}
      />
      <Button
        text="Skapa"
        disabled={mapData.marker === undefined}
        onClick={handleCreate}
      />
    </div>
  );
};

export default NewGame;
