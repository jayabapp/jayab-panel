import "leaflet/dist/leaflet.css";
import { useState, useEffect, useCallback } from "react";
import Searchbox from "../Searchbox";
import SearchDropDown from "./SearchDropdown";
import _, { debounce, isEmpty } from "lodash";
import * as Leaflet from "react-leaflet";
import L from "leaflet";
import { MapPinIcon } from "@heroicons/react/24/solid";

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

function LocationMarker({
  useMap,
  setNewCenter,
}: {
  useMap: any;
  setNewCenter: (e: { lat: number; lng: number }) => void | null;
}) {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e: any) {
      console.log("bounds", e?.bounds);

      map.flyTo(e.latlng, map.getZoom());

      let newLoc = e.bounds.toBBoxString().split(",");

      setNewCenter({ lat: Number(newLoc[1]), lng: Number(newLoc[0]) });
    });
  }, [map]);
  return <></>;
}

const Map = ({ title, initLoc = { lat: 35.75399, lng: 51.368563 }, onDragEnd, options, markers }: PropTypes) => {
  const center = initLoc;
  const [newCenter, setNewCenter] = useState(center);
  const [isLoading, setIsLoading] = useState(false);
  const [latLng, setLatLng] = useState<CoordinateType>({ x: 0, y: 0 });
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDraging, setisDraging] = useState(false);
  const [showHere, setShowHere] = useState(false);
  function setShowHereFunction() {
    setShowHere(true);
    setTimeout(() => setShowHere(false), 1500);
  }

  useEffect(() => {
    checkDraging();
  }, [newCenter]);

  useEffect(() => {
    if (!isDraging) {
      onDragEnd(newCenter);
    }
  }, [isDraging]);

  const checkDraging = useCallback(
    debounce(() => {
      setisDraging(false);
    }, 1000),
    []
  );

  function DragComponent() {
    setisDraging(true);
    Leaflet.useMapEvents({
      dragend: (e: any) => {
        setNewCenter(e.target.getCenter());
      },
    });

    return null;
  }

  function SetViewOnSearch({ location }: { location: CoordinateType }) {
    setisDraging(true);
    const map = Leaflet.useMap();
    if (!_.isEmpty(location)) {
      map.flyTo([location.y, location.x], 14, {
        duration: 2,
      });
      // const a = map.getCenter();
      setNewCenter({ lat: location.y, lng: location.x });
      setLatLng({ x: 0, y: 0 });
    }

    return null;
  }
  const onSearch = async (name: string) => {
    setIsLoading(true);
    await fetch(`https://api.neshan.org/v1/search?term=${name}&lat=${newCenter?.lat}&lng=${newCenter?.lng}`, {
      method: "GET",
      headers: {
        "Api-Key": `service.d6f1242dfcd545caabd073b4aa958d8b`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.items);
        setIsOpen(true);
        // callback(data.formatted_address);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  return (
    <div
      style={{
        borderRadius: "1rem",
        zIndex: 10,
      }}
      className={`relative h-full my-4 rounded-4 w-11/12 mx-auto  ${options?.containerClass}`}
    >
      <label
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title || ""}
        <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
      </label>
      <Leaflet.MapContainer
        id="leafletmap"
        scrollWheelZoom={"center"}
        touchZoom={"center"}
        center={newCenter}
        zoom={15}
        style={{
          height: options?.customeHieght ?? "400px",
        }}
        zoomControl={true}
        className="rounded-xl"
      >
        {showHere ? <LocationMarker useMap={Leaflet?.useMap} setNewCenter={setNewCenter} /> : <></>}
        <>
          <DragComponent />
          <Leaflet.TileLayer
            // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!!latLng?.x && <SetViewOnSearch location={latLng} />}
          {/* MARKERS */}
          {markers && markers?.length > 0 ? (
            <>
              {markers?.map((e, index) => (
                <Leaflet.Marker
                  key={`marketNumber${index}`}
                  icon={L.icon({
                    iconUrl: e?.icon,
                    iconSize: [45, 45], // size of the icon
                    shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62], // the same for the shadow
                    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
                  })}
                  position={{ lat: e?.lat, lng: e?.lng }}
                ></Leaflet.Marker>
              ))}
            </>
          ) : (
            <></>
          )}
        </>
      </Leaflet.MapContainer>
      <div
        className="absolute location-here bottom-8 cursor-pointer "
        // style={{ zIndex: 20000 }}
        onClick={() => setShowHereFunction()}
      >
        <img src="/assets/icons/here.svg" />
      </div>
      {!options?.disableSearch ? (
        <div className="flex justify-center">
          <div className="absolute top-5 mt-4 w-[90%] lg:w-[70%]  z-[500]">
            <Searchbox
              placeholder={"جستجوی مکان"}
              initValue=""
              boxId="MAP_SEARCH_BOX"
              onSubmit={(v: string | null) => {
                if (v) {
                  onSearch(v);
                }
              }}
              onClear={() => {
                setLatLng({ x: 0, y: 0 });
                setIsOpen(false);
              }}
            />
            {!isEmpty(data) && (
              <div className="absolute top-5 mt-12  w-full" style={{ zIndex: 2000 }}>
                <SearchDropDown
                  items={data}
                  onSelect={(coordinate: CoordinateType) => {
                    setLatLng(coordinate);
                    setIsOpen(false);
                  }}
                  isOpen={isOpen}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!options?.disableCenterMarker ? (
        <div className="absolute  -mr-5    right-1/2 top-1/2 z-[500]">
          <MapPinIcon className="w-10 h-10 text-red-500" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Map;
