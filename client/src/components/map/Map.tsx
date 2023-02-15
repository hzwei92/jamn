import { IonContent, IonPage } from "@ionic/react"
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../app/AppProvider";
// @ts-ignore
import mapboxgl, { Map  } from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { MAPBOX_ACCESS_TOKEN } from "../../constants";
import './Map.css';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const { isDarkMode } = useContext(AppContext);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    // @ts-ignore
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      trackResize: true,
    });
    setTimeout(() => {
      map.current.resize();
    }, 1); 
  });

  return (
    <IonPage>
      <IonContent style={{
        position: 'relative',
      }}>
        <div ref={mapContainer} className='map-container' style={{
          height: '100%',
        }}/>
      </IonContent>
    </IonPage>
  );
}

export default MapComponent;