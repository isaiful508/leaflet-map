import React, { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapWithDraw = () => {
  const featureGroupRef = useRef(null);

  const handleCreated = (e) => {
    const type = e.layerType;
    const layer = e.layer;

    featureGroupRef.current?.addLayer(layer);

    console.log("New shape:", type, layer.getLatLngs());
  };

  const handleEdited = (e) => {
    console.log("Edited shapes:", e.layers.getLayers());
  };

  const handleDeleted = (e) => {
    console.log("Deleted shapes:", e.layers.getLayers());
  };

  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
          draw={{
            polyline: true,
            polygon: true,
            rectangle: true,
            circle: false,
            marker: false,
            circlemarker: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapWithDraw;
