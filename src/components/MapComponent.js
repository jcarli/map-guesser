import React, { useRef, useState, useEffect } from "react";
import MapContext from "@/map/MapContext";
import * as ol from "ol";
import Map from "ol/Map";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj.js";
import { Projection } from "ol/proj.js";
import olms from "ol-mapbox-style";

const MapComponent = ({
  children,
  zoom,
  center,
  gameFunc,
  captureMapData,
  hideInformation,
}) => {
  const mapRef = useRef(null);
  var sourceRef = null;
  const [map, setMap] = useState(null);
  const [currMarker, setCurrMarker] = useState(undefined);
  const [currCenter, setCurrCenter] = useState(center);
  const [currZoom, setCurrZoom] = useState(zoom);
  const [mapData, setMapData] = useState(undefined);

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
        constrainResolution: false,
        center: center,
        enableRotation: false,
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

    if (hideInformation) {
      olms(
        mapObject,
        "https://api.maptiler.com/maps/b81bf257-847f-4195-9400-e088211a98ef/style.json?key=DPgMbCMF3WTd3QIM4mLw"
      );
    }
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

  useEffect(() => {
    if (!map) return;
    map.on("moveend", function (e) {
      var newZoom = map.getView().getZoom();
      var newCenter = map.getView().getCenter();

      let mapData = {
        zoom: newZoom,
        center: newCenter,
        marker: currMarker,
      };
      captureMapData(mapData);
    });
  });

  //marker handler
  useEffect(() => {
    if (!map) return;
    map.on("singleclick", function (evt) {
      if (map) {
        if (sourceRef) {
          sourceRef.clear(false);
          //setCurrMarker(undefined);
        }
        var pixel = evt.pixel;
        var coordinate = map.getCoordinateFromPixel(pixel);
        var lonLat = fromLonLat(coordinate, new Projection("EPSG:3857"));
        var feature = new Feature({
          geometry: new Point(lonLat),
          type: "Point",
        });
        feature.set("info", "info 1");
        var source = new VectorSource({
          features: [feature],
        });
        sourceRef = source;
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
          }),
        });
        layer.set("layerId", "Point");
        var pixel = evt.pixel;
        var coordinate = map.getCoordinateFromPixel(evt.pixel);
        map.addLayer(layer);
        setCurrMarker(lonLat);
      } else {
        setTimeout(
          function () {
            var pixel = evt.pixel;
            var coordinate = map.getCoordinateFromPixel(pixel);
            var lonLat = fromLonLat(coordinate, new Projection("EPSG:3857"));
            var feature = new Feature({
              geometry: new Point(lonLat),
              type: "Point",
            });
            feature.set("info", "info 1");
            var layer = new VectorLayer({
              source: new VectorSource({
                features: [feature],
              }),
              style: new Style({
                image: new Icon({
                  anchor: [0.5, 46],
                  anchorXUnits: "fraction",
                  anchorYUnits: "pixels",
                  src: "../assets/img/location.png",
                  scale: 0.05,
                }),
              }),
            });
            layer.set("layerId", "Point");
            map.addLayer(layer);
            setCurrMarker(lonLat);
          }.bind(this),
          500
        );
      }
    });
  });

  useEffect(() => {
    if (!map) return;
    let mapData = {
      zoom: map.getView().getZoom(),
      center: map.getView().getCenter(),
      marker: currMarker,
    };
    captureMapData(mapData);
  }, [currMarker]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default MapComponent;
