// import React from 'react';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polygon,
//   useMapEvents,
//   useMap
// } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './App.css';

// // Fix default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
// });

// // Add marker on click
// function ClickHandler({ setMarkers }) {
//   useMapEvents({
//     click(e) {
//       setMarkers(prev => [...prev, e.latlng]);
//     }
//   });
//   return null;
// }

// // Move map and show user location
// function ShowUserLocation({ location }) {
//   const map = useMap();

//   React.useEffect(() => {
//     if (location) {
//       map.setView(location, 13);
//     }
//   }, [location, map]);

//   return location ? (
//     <Marker position={location}>
//       <Popup>Your Location</Popup>
//     </Marker>
//   ) : null;
// }

// function App() {
//   const [clickMarkers, setClickMarkers] = React.useState([]);
//   const [userLocation, setUserLocation] = React.useState(null);

//   const center = [51.505, -0.09];
//   const polygon = [
//     [51.515, -0.09],
//     [51.52, -0.1],
//     [51.52, -0.12]
//   ];

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by your browser');
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         });
//       },
//       () => {
//         alert('Please turn on location to use this feature');
//       }
//     );
//   };

//   return (
//     <div className="app">
//       <div className='map-wrapper'>
//         <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '90vh' }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {/* Static marker */}
//           <Marker position={center}>
//             <Popup>Default Marker with popup</Popup>
//           </Marker>

//           {/* Click-based dynamic markers */}
//           {clickMarkers.map((pos, i) => (
//             <Marker key={i} position={pos}>
//               <Popup>Marker #{i + 1}</Popup>
//             </Marker>
//           ))}

//           <ClickHandler setMarkers={setClickMarkers} />

//           {/* Polygon */}
//           <Polygon positions={polygon} color="purple">
//             <Popup>Polygon Area</Popup>
//           </Polygon>

//           {/* User location */}
//           <ShowUserLocation location={userLocation} />
//           <button className='locate-btn' onClick={handleGetLocation}>
//             📍
//           </button>
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default App;




// import React from 'react';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polygon,
//   useMapEvents,
//   useMap
// } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './App.css';

// // Fix default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
// });

// // Add marker on click
// function ClickHandler({ setMarkers }) {
//   useMapEvents({
//     click(e) {
//       setMarkers(prev => [...prev, e.latlng]);
//     }
//   });
//   return null;
// }

// // Show user location
// function ShowUserLocation({ location }) {
//   const map = useMap();

//   React.useEffect(() => {
//     if (location) {
//       map.setView(location, 13);
//     }
//   }, [location, map]);

//   return location ? (
//     <Marker position={location}>
//       <Popup>Your Location</Popup>
//     </Marker>
//   ) : null;
// }

// // Show search result
// function SearchResultMarker({ location }) {
//   const map = useMap();

//   React.useEffect(() => {
//     if (location) {
//       map.setView(location, 14);
//     }
//   }, [location, map]);

//   return location ? (
//     <Marker position={location}>
//       <Popup>Search Result</Popup>
//     </Marker>
//   ) : null;
// }

// function App() {
//   const [clickMarkers, setClickMarkers] = React.useState([]);
//   const [userLocation, setUserLocation] = React.useState(null);
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [searchResult, setSearchResult] = React.useState(null);

//   const center = [51.505, -0.09];
//   const polygon = [
//     [51.515, -0.09],
//     [51.52, -0.1],
//     [51.52, -0.12]
//   ];

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by your browser');
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         });
//       },
//       () => {
//         alert('Please turn on location to use this feature');
//       }
//     );
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           searchQuery
//         )}`
//       );
//       const data = await response.json();

//       if (data && data.length > 0) {
//         const place = data[0];
//         const location = {
//           lat: parseFloat(place.lat),
//           lng: parseFloat(place.lon)
//         };
//         setSearchResult(location);
//       } else {
//         alert('Location not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching location:', error);
//       alert('Error searching location.');
//     }
//   };

//   return (
//     <div className="app">
//       <div className="map-wrapper">
//         {/* Search Input */}
//         <div className="search-container">
//           <input
//             type="text"
//             placeholder="Search location..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button onClick={handleSearch}>Search</button>
//         </div>

//         {/* Map */}
//         <MapContainer
//           center={center}
//           zoom={13}
//           scrollWheelZoom={true}
//           style={{ height: '90vh' }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {/* Static marker */}
//           <Marker position={center}>
//             <Popup>Default Marker with popup</Popup>
//           </Marker>

//           {/* Click markers */}
//           {clickMarkers.map((pos, i) => (
//             <Marker key={i} position={pos}>
//               <Popup>Marker #{i + 1}</Popup>
//             </Marker>
//           ))}

//           <ClickHandler setMarkers={setClickMarkers} />

//           {/* Polygon */}
//           <Polygon positions={polygon} color="purple">
//             <Popup>Polygon Area</Popup>
//           </Polygon>

//           {/* User Location */}
//           <ShowUserLocation location={userLocation} />

//           {/* Search Result Marker */}
//           <SearchResultMarker location={searchResult} />
//         </MapContainer>

//         {/* 📍 Floating location button */}
//         <button className="locate-btn" onClick={handleGetLocation}>
//           📍
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;

// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import RoutingMachine from './RoutingMachine';
import './App.css';

// Fix Leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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




function App() {
  const mapRef = useRef();
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const center = [51.505, -0.09];

  const geocode = async (query) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const [from, to] = await Promise.all([
        geocode(fromText),
        geocode(toText),
      ]);
      if (from && to) {
        setFromCoords(from);
        setToCoords(to);
      } else {
        alert('Could not find one or both locations.');
      }
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
          lng: position.coords.longitude
        });
      },
      () => {
        alert('Please turn on location to use this feature');
      }
    );
  };

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="From"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="To"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

        <button className="locate-button" onClick={handleGetLocation}>
          📍 Locate Me
        </button>
     

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
        {/* User Location */}
        <ShowUserLocation location={userLocation} />

        <RoutingMachine from={fromCoords} to={toCoords} />
      </MapContainer>
    </div>
  );
}

export default App;



