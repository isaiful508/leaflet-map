import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix Leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper function to decode polyline
const decodePolyline = (encoded) => {
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0, coordinates = [];

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
};

// Show user location
function ShowUserLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location, 13);
    }
  }, [location, map]);

  return location ? (
    <Marker position={location}>
      <Popup>Your Location</Popup>
    </Marker>
  ) : null;
}

// Get route from GraphHopper
const getDistanceFromGraphHopper = async (from, to, vehicle = 'car') => {
  const url = `https://graphhopper.com/api/1/route?point=${from.lat},${from.lng}&point=${to.lat},${to.lng}&vehicle=${vehicle}&locale=en&points_encoded=true&key=c17662ef-aa10-4639-89db-2b7af6720aec`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.paths && data.paths.length > 0) {
    const path = data.paths[0];
    const coordinates = decodePolyline(path.points);

    return {
      distance: (path.distance / 1000).toFixed(2),
      time: Math.round(path.time / 60000),
      coordinates,
    };
  } else {
    return null;
  }
};

function App() {
  const mapRef = useRef();
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [vehicle, setVehicle] = useState('car'); // car, bike, foot

  const center = [23.7806, 90.2792]; // Dhaka default center

  const geocode = async (query) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  };

  const handleGetDirections = async () => {
    const [from, to] = await Promise.all([geocode(fromText), geocode(toText)]);
    if (from && to) {
      setFromCoords(from);
      setToCoords(to);

      const result = await getDistanceFromGraphHopper(from, to, vehicle);
      console.log({routeCoords, result, from, to, fromCoords, toCoords})
      if (result) {
        setRouteInfo({ distance: result.distance, time: result.time });
        setRouteCoords(result.coordinates);
      } else {
        setRouteInfo(null);
        setRouteCoords([]);
        alert('No route found.');
      }
    } else {
      alert('Could not find one or both locations.');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert('Please turn on location to use this feature');
      }
    );
  };

  // Refetch route on vehicle change if coordinates already set
  useEffect(() => {
    if (fromCoords && toCoords) {
      handleGetDirections();
    }
  }, [vehicle]);

  useEffect(() => {
    if (mapRef.current && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      mapRef.current.fitBounds(bounds);
    }
  }, [routeCoords]);

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="From"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
        />
        <input
          type="text"
          placeholder="To"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
        />
        <button className="locate-button" onClick={handleGetLocation}>
          📍 Locate Me
        </button>

        <div className="transport-selector">
          <button onClick={() => setVehicle('car')} className={vehicle === 'car' ? 'active' : ''}>🚗</button>
          <button onClick={() => setVehicle('bike')} className={vehicle === 'bike' ? 'active' : ''}>🚲</button>
          <button onClick={() => setVehicle('foot')} className={vehicle === 'foot' ? 'active' : ''}>🚶</button>
        </div>

        <button className="get-direction-button" onClick={handleGetDirections}>
          ➡️ Get Directions
        </button>
      </div>

      {routeInfo && (
        <div className="route-info">
          Distance: {routeInfo.distance} km | Time: {routeInfo.time} mins
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '90vh' }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {fromCoords && (
          <Marker position={fromCoords}>
            <Popup>From: {fromText}</Popup>
          </Marker>
        )}

        {toCoords && (
          <Marker position={toCoords}>
            <Popup>To: {toText}</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={5} />
        )}

        <ShowUserLocation location={userLocation} />
      </MapContainer>
    </div>
  );
}

export default App;





