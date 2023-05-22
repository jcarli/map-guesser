import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Button from "./Button";
import MapDisplay from "./MapDisplay";
import axios from "axios";

const Game = () => {
  const router = useRouter();
  const input = useRef();
  const [state, setState] = useState("");
  const [game, setGame] = useState(undefined);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(0);
  const [marker, setMarker] = useState(undefined);
  const [mapData, setMapData] = useState({
    zoom: zoom,
    center: center,
    marker: marker,
  });

  const handleClick = () => {
    setState(input.current.value);
  };

  const createAnswer = (mapValues) => {
    setMapData(mapValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let teamName = state;
    let marker = mapData.marker;
    let gameName = game.name;

    await axios.post("/api/db/submitanswer", { teamName, gameName, marker });

    await router.push("/");
  };

  useEffect(() => {
    let gameObject = JSON.parse(router.query.game);
    setGame(gameObject);
    setCenter(gameObject.center.split(",").map(Number));
    setZoom(gameObject.zoom);
  }, [router.query]);

  return (
    <>
      <MapDisplay
        startZoom={zoom}
        startCenter={center}
        createGame={createAnswer}
        hideInformation={true}
      />
      <div className="lower-card">
        <div className="form__group field">
          <input
            type="input"
            onChange={handleClick}
            ref={input}
            className="form__field"
            placeholder="Lagnamn"
            name="Lagnamn"
            id="Lagnamn"
            required
          />
        </div>
        <Button
          text="Lås in"
          path="/"
          disabled={mapData.marker === undefined || state === ""}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default Game;
