import React, { useEffect, useState } from 'react';
import './MapPage.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import BottomActionBar from '../../components/Shared/BottomActionBar';

const defaultCenter = [63.4305, 10.3951]; // Trondheim center as demo

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 14); }, [center, map]);
  return null;
}

export default function MapPage() {
  const [center, setCenter] = useState(defaultCenter);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setReady(true); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setCenter([pos.coords.latitude, pos.coords.longitude]); setReady(true); },
      () => setReady(true),
      { enableHighAccuracy: true, timeout: 4000 }
    );
  }, []);

  const safehavens = [
    { id: 1, pos: [center[0] + 0.003, center[1] + 0.004], label: 'Safe Haven A' },
    { id: 2, pos: [center[0] - 0.004, center[1] + 0.002], label: 'Safe Haven B' },
    { id: 3, pos: [center[0] - 0.002, center[1] - 0.004], label: 'Safe Haven C' },
  ];

  const onCall = () => alert('Call action placeholder');
  const onActivate = () => window.location.assign('/alarm');
  const onVideo = () => alert('Video action placeholder');

  return (
    <div className="mapPage-wrapper">
      <header className="mapPage-header">Map</header>
      <div className="mapPage-map">
        <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <Recenter center={center} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* User position */}
          {ready && (
            <CircleMarker center={center} radius={10} color="#de4242" fillColor="#de4242" fillOpacity={0.9}>
              <Popup>You are here</Popup>
            </CircleMarker>
          )}
          {/* Mock safe havens */}
          {safehavens.map(s => (
            <CircleMarker key={s.id} center={s.pos} radius={12} color="#2e7d32" fillColor="#2e7d32" fillOpacity={0.85}>
              <Popup>{s.label}</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Chat placeholder */}
      <div className="mapPage-chat">
        <div className="msg msg-in">what happend? i am coming</div>
        <div className="msg msg-out">i need help quickly!!!!!!!</div>
        <div className="mapPage-chatInput">
          <input placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>

      <BottomActionBar onCall={onCall} onActivate={onActivate} onVideo={onVideo} />
    </div>
  );
}
