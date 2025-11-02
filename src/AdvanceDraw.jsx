import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const GeomanControl = () => {
  const map = useMap();

  useEffect(() => {
    // Add Geoman controls with custom options
    map.pm.addControls({
      position: "topleft",
      drawMarker: true,
      drawCircle: true,
      drawCircleMarker: true,
      drawRectangle: true,
      drawPolygon: true,
      drawPolyline: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
    });

    // Listen for events
    map.on("pm:create", (e) => {
      console.log("Created shape:", e.layer.getLatLngs());
    });

    map.on("pm:edit", (e) => {
      console.log("Edited layer:", e.layer.getLatLngs());
    });

    map.on("pm:remove", (e) => {
      console.log("Removed layer:", e.layer.getLatLngs());
    });
  }, [map]);

  return null;
};

const AdvancedDrawMap = () => {
  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeomanControl />
    </MapContainer>
  );
};

export default AdvancedDrawMap;
