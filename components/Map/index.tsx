/**
 * نقشه نشان به جای لیف لت برای نت ملی
 * این نسخه فعلا فقط نمایش موقعیت مکانی رو داره
 */

import { useState, useEffect, useCallback, useRef } from "react";
import _, { debounce, isEmpty } from "lodash";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
const API_KEY = "web.4c0887bbd32f4ab2ba1adcc36243b6a2";

type PropTypes = {
  title?: string;
  initLoc?: RegionType;
  onDragEnd: Function;
  options?: OptionType;
  markers?: { lat: number; lng: number; icon: string }[];
};
export type RegionType = {
  lat: number;
  lng: number;
};

export type CoordinateType = {
  x: number;
  y: number;
};
type OptionType = {
  customeHieght?: string;
  containerClass?: string;
  disableSearch?: boolean;
  disableCenterMarker?: boolean;
  isMandatory?: boolean;
  titleClass?: string;
  titleHint?: string;
};

const Map = ({
  title,
  initLoc = { lat: 35.75399, lng: 51.368563 },
  onDragEnd,
  options,
  markers,
}: PropTypes) => {
  const map = useRef<any>(null);
  const center = initLoc;
  // const [newCenter, setNewCenter] = useState(center);
  // const [isLoading, setIsLoading] = useState(false);
  // const [latLng, setLatLng] = useState<CoordinateType>({ x: 0, y: 0 });
  // const [data, setData] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);
  // const [isDraging, setisDraging] = useState(false);
  // const [showHere, setShowHere] = useState(false);

  useEffect(() => {
    map.current = new nmp_mapboxgl.Map({
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      container: map.current || "map",
      center: initLoc,
      zoom: 15,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: API_KEY,
      poi: false,

      traffic: false,
      mapTypeControllerOptions: {
        show: false,
        position: "top-left",
      },
    });

    map.current.addControl(
      new nmp_mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 30000,
        },
        showAccuracyCircle: true,
        showUserLocation: true,
        trackUserLocation: true,
        showUserHeading: true,
      }),
    );
    // map.current.addControl(new nmp_mapboxgl.NavigationControl(), "top-right");
    // map.current.on("dragend", (e) => {
    //   console.log(e);
    // });

    new nmp_mapboxgl.Marker()
      .setLngLat([initLoc.lng, initLoc.lat])
      .addTo(map.current);
  }, []);

  return (
    <div
      style={{
        borderRadius: "1rem",
        zIndex: 10,
      }}
      className={`relative h-[300px] mt-4 mb-12 rounded-4 w-11/12 mx-auto  ${options?.containerClass}`}
    >
      <label
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory &&
          "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title || ""}
        <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
      </label>
      <div ref={map} id="map" className="absolute w-full h-full " />
    </div>
  );
};
export default Map;
