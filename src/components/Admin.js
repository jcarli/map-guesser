import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
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

const Admin = () => {
  const router = useRouter();
  const [game, setGame] = useState(undefined);
  const [name, setName] = useState(router.query.name);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [answers, setAnswers] = useState([]);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [winner, setWinner] = useState("");

  const vectorLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: "src/assets/img/location.png",
      }),
    }),
  });

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({
        constrainResolution: true,
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
      "https://api.maptiler.com/maps/b81bf257-847f-4195-9400-e088211a98ef/style.json?key=DPgMbCMF3WTd3QIM4mLw "
    );
    return () => mapObject.setTarget(undefined);
  }, []);
  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
    //setCurrZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
    //setCurrCenter(center);
  }, [center]);

  function toggle() {
    setShowMap(!showMap);
  }

  const getAnswers = async (e) => {
    e.preventDefault();

    const res = await axios.get("/api/db/getanswers", {
      params: {
        name: name,
      },
    });
    var stripped = res.data.answers.map((answer) => {
      return {
        name: answer.name,
        coordinates: answer.coordinates.split(",").map((c) => parseFloat(c)),
      };
    });
    let reference = {
      name: "<Referens>",
      coordinates: game.marker.split(",").map((c) => parseFloat(c)),
    };
    stripped.push(reference);
    setAnswers(stripped);
    setWinner("");
  };

  const placeMarker = (coordinate, name) => {
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
          src: "../assets/img/location.png",
          scale: 0.01,
        }),
        text: new Text({
          font: "20px Calibri,sans-serif",
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          text: name != "<Referens>" ? name : "",
          offsetX: 0,
          offsetY: -55,
        }),
      }),
    });
    layer.set("layerId" + name, "Point");
    map.addLayer(layer);

    if (name === "<Referens>") {
      var coordinates = answers.slice(0, -1);
      var list = coordinates.map((c) => {
        return {
          name: c.name,
          distance: distanceBetweenPoints(
            c.coordinates,
            game.marker.split(",").map((c) => parseFloat(c))
          ),
        };
      });
      let winningTeam = list.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
      );

      setWinner("" + winningTeam.name + " (" + winningTeam.distance + " km)");
    }
  };

  function distanceBetweenPoints(latlng1, latlng2) {
    var length = getDistance(
      transform(latlng1, "EPSG:3857", "EPSG:4326"),
      transform(latlng2, "EPSG:3857", "EPSG:4326")
    );
    return Math.round(length / 1000);
  }

  useEffect(() => {
    const getGame = async (e) => {
      const res = await axios.get("/api/db/getgame", {
        params: {
          name: router.query.name,
        },
      });

      let c = "" + res.data.game.center;
      setGame(res.data.game);
      setName(router.query.name);
      setCenter(c.split(",").map(Number));
      setZoom(res.data.game.zoom);
    };
    getGame().catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>
        <span className="gradient-text">{name}</span>
      </h2>
      {/*The bottom code should toggle on and off when the button is pressed*/}
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
        <div className="answers">
          {answers.map((answer) => {
            return (
              <span
                className="answer"
                key={answer.name}
                onClick={() => placeMarker(answer.coordinates, answer.name)}
              >
                {answer.name}
              </span>
            );
            /**  */
          })}
        </div>
      </div>
      <span
        className="gradient-text"
        style={{
          display: winner === "" ? "none" : "block",
        }}
      >
        <h1> Winner: {winner}</h1>
      </span>
    </div>
  );
};

export default Admin;
