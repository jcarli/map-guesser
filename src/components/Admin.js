import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import * as ol from "ol";
import Map from "ol/Map";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Point from "ol/geom/Point";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { Feature } from "ol";
import { getDistance } from "ol/sphere";
import { transform } from "ol/proj.js";
import olms from "ol-mapbox-style";
import { useQRCode } from "next-qrcode";

const Admin = (props) => {
  const { SVG } = useQRCode();

  const game = JSON.parse(props.game);

  const [center, setCenter] = useState(game.center.split(",").map(Number));
  const [zoom, setZoom] = useState(game.zoom);
  const [showMap, setShowMap] = useState(false);
  const [answers, setAnswers] = useState([]);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [winner, setWinner] = useState("");

  const vectorLayer = new VectorLayer({
    source: new VectorSource(),
  });

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({
        constrainResolution: false,
        center: center,
        zoom: zoom,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      controls: [],
      overlays: [],
    };
    let mapObject = new Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    olms(
      mapObject,
      "https://api.maptiler.com/maps/b81bf257-847f-4195-9400-e088211a98ef/style.json?key=DPgMbCMF3WTd3QIM4mLw"
    );
    return () => mapObject.setTarget(undefined);
  }, []);
  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  function toggle() {
    setShowMap(!showMap);
  }

  const getAnswers = async (e) => {
    e.preventDefault();

    const res = await axios.get("/api/db/getanswers", {
      params: {
        name: game.name,
      },
    });
    var stripped = res.data.answers.map((answer) => {
      return {
        name: answer.name,
        coordinates: answer.coordinates.split(",").map((c) => parseFloat(c)),
      };
    });

    setAnswers(stripped);
    setWinner("");
  };

  const placeMarker = (coordinate, name, fileName) => {
    var feature = new Feature({
      geometry: new Point(coordinate),
      type: "Point",
    });
    feature.set("info", name);
    var source = new VectorSource({
      features: [feature],
    });
    var layer = new VectorLayer({
      source: source,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 4557],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: `../assets/img/${fileName}.png`,
          scale: 0.01,
        }),
        text: new Text({
          font: "20px Calibri,sans-serif",
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
          text: name,
          offsetX: 0,
          offsetY: -55,
        }),
      }),
    });
    layer.set("layerId" + name, "Point");
    map.addLayer(layer);
  };

  function calculateWinner() {
    let referenceCoords = game.marker.split(",").map((c) => parseFloat(c));

    if (answers.length === 0) {
      return;
    }

    var list = answers.map((c) => {
      return {
        name: c.name,
        distance: distanceBetweenPoints(c.coordinates, referenceCoords),
      };
    });

    let winningTeam = list.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    );

    placeMarker(referenceCoords, "", "location-yellow");
    setWinner("" + winningTeam.name + " (" + winningTeam.distance + " km)");
  }

  function distanceBetweenPoints(latlng1, latlng2) {
    var length = getDistance(
      transform(latlng1, "EPSG:3857", "EPSG:4326"),
      transform(latlng2, "EPSG:3857", "EPSG:4326")
    );
    return Math.round(length / 1000);
  }

  function toggleSize() {
    document.getElementById("qr-code").classList.toggle("qr-code-large");
  }

  return (
    <div className="container">
      <div id="qr-code" className="qr-code" onClick={toggleSize}>
        <SVG
          text={`https://map-guesser-coral.vercel.app/game/${game.name}`}
          options={{
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          }}
        />
      </div>

      <h2>
        <span className="gradient-text">{game.name}</span>
      </h2>
      <div
        style={{
          display: showMap ? "block" : "none",
        }}
      >
        <div ref={mapRef} className="ol-map"></div>
      </div>
      <div className="buttons">
        <Button onClick={toggle} text={showMap ? "Göm karta" : "Visa karta"} />

        <Button onClick={getAnswers} text={"Hämta svar"} />

        <Button onClick={calculateWinner} text={"Visa vinnare"} />
      </div>
      <span
        className="gradient-text"
        style={{
          display: winner === "" ? "none" : "block",
        }}
      >
        <h2> Vinnare: {winner}</h2>
      </span>
      <div className="answers">
        {answers.map((answer) => {
          return (
            <span
              className="answer"
              key={answer.name}
              onClick={() =>
                placeMarker(answer.coordinates, answer.name, "location-blue")
              }
            >
              {answer.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
