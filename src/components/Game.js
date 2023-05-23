import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Button from "./Button";
import MapDisplay from "./MapDisplay";
import axios from "axios";

const Game = (props) => {
  const router = useRouter();
  const input = useRef();

  const game = JSON.parse(props.data);
  const center = game.center.split(",").map(Number);
  const zoom = game.zoom;

  const [state, setState] = useState("");
  const [marker, setMarker] = useState(undefined);
  const [mapData, setMapData] = useState({
    zoom: zoom,
    center: center,
    marker: marker,
  });

  const teamNameChange = () => {
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

  return (
    <div className="container">
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
            onChange={teamNameChange}
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
    </div>
  );
};

export default Game;
