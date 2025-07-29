// DhakaGeoJSON.jsx
import { useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

const DhakaGeoJSON = () => {
  const map = useMap();

  useEffect(() => {
    fetch('/dhaka.json')
      .then(res => res.json())
      .then(data => {
        console.log({data})
        const geoJsonLayer = new L.GeoJSON(data, {
          style: {
            color: 'blue',
            weight: 2,
            fillColor: 'lightblue',
            fillOpacity: 0.3,
          }
        });

        geoJsonLayer.addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
      })
      .catch(err => {
        console.error("Failed to load GeoJSON", err);
      });
  }, [map]);

  return null;
};

export default DhakaGeoJSON;
