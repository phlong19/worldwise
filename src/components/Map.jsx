import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlLocation } from "../hooks/useUrlLocation";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const {
    getPosition,
    isLoading: isLoadingPosition,
    position: mapPositionLocation,
  } = useGeoLocation();

  const [lat, lng] = useUrlLocation();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (mapPositionLocation)
        setMapPosition([mapPositionLocation.lat, mapPositionLocation.lng]);
    },
    [mapPositionLocation]
  );

  return (
    <div className={styles.mapContainer}>
      {mapPositionLocation && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={4}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((c) => (
          <Marker key={c.id} position={c.position}>
            <Popup>
              <span>{c.emoji}</span>
              <span>{c.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePosition position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangePosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
