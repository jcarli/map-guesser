import React, { useState, useCallback, useEffect } from "react";
import Layers from "../map/layers/Layers";
import TileLayer from "../map/layers/TileLayers";
import { osm } from "@/map/source";
import Controls from "@/map/controls/Controls";
import FullScreenControl from "@/map/controls/FullScreenControl";
import MapComponent from "@/components/MapComponent";

const MapDisplay = ({
  startZoom,
  startCenter,
  createGame,
  hideInformation,
}) => {
  const [center, setCenter] = useState(startCenter);
  const [zoom, setZoom] = useState(startZoom);
  const [marker, setMarker] = useState(undefined);
  const [mapData, setMapData] = useState({
    zoom: zoom,
    center: center,
    marker: marker,
  });

  const captureMapData = (mapValues) => {
    setMapData(mapValues);
    createGame(mapValues);
  };

  const gameFunc = (val) => {
    createGame(val);
  };

  return (
    <>
      <MapComponent
        center={startCenter}
        zoom={startZoom}
        marker={marker}
        gameFunc={gameFunc}
        captureMapData={captureMapData}
        hideInformation={hideInformation}
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
        </Layers>
        <Controls>
          {" "}
          <FullScreenControl />{" "}
        </Controls>
      </MapComponent>
    </>
  );
};

export default MapDisplay;
