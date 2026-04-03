/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useCities } from "../../contexts/CitiesContext";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();
  const { cities, isLoading } = useCities();
  const [searchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  // 1. Sync map position with URL
  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([Number(mapLat), Number(mapLng)]);
      }
    },
    [mapLat, mapLng],
  );

  // 2. Loading state check
  if (isLoading) return <div className={styles.mapContainer}>Loading...</div>;

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        // This KEY is vital: it forces the map to refresh instead of crashing
        key={mapPosition.join(",")}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities?.map((city) => {
          // Safety guard for position
          if (!city.position?.lat || !city.position?.lng) return null;

          return (
            <Marker
              position={[Number(city.position.lat), Number(city.position.lng)]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span> <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default Map;
