import React, { useState, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Circle } from "@react-google-maps/api";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import StoreContext from "../..";
import { Alert, TextField, useMediaQuery } from "@mui/material";

const center = { lat: 50.51968717566745, lng: 30.242334934233245 };
const optionsCircle = {
  strokeColor: "#ad160c",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: "#000",
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};
const libraries = ["places"];

const containerStyle = {
  width: "600px",
  height: "500px",
};

const containerStyleMoblie = {
  width: "100%",
  height: "330px",
};

const GoogleMapRender = () => {
  const { store } = useContext(StoreContext);
  const desktop = useMediaQuery("(min-width:601px)");
  const mobile = useMediaQuery("(max-width:600px)");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: libraries,
  });

  const onPlaceChanged = async () => {
    if (searchResult != null) {
      // const place = searchResult.getPlace();
      // const formattedAddress = place.formatted_address;
      await calculateRoute();
      fortmatTime(store.durationTime);
    } else {
      alert("Please enter text");
    }
  };

  const onLoad = (autocomplete) => {
    setSearchResult(autocomplete);
  };

  const [searchResult, setSearchResult] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const [minDurationTime, setMinDurationTime] = useState("");
  const [maxDurationTime, setMaxDurationTime] = useState("");

  const [alerError, setAlertError] = useState(false);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef("");
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef("");

  if (!isLoaded) {
    return <Typography>Loading...</Typography>;
  }

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      clearRoute();
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const lat = results.routes[0].legs[0].end_location.lat();
    const lng = results.routes[0].legs[0].end_location.lng();

    // setDirectionsResponse(results);
    // store.setDurationTime(Number(results.routes[0].legs[0].duration.value));
    // store.setDestinationPlace(destinationRef.current.value);
    // store.setOriginPlace(originRef.current.value);

    const isCorrect = correctDistance(lat, lng);
    if (!isCorrect) {
      setAlertError(true);
      setTimeout(() => {
        clearRoute();
        setAlertError(false);
      }, 10000);
    } else {
      setDirectionsResponse(results);
      store.setDurationTime(Number(results.routes[0].legs[0].duration.value));
      store.setDestinationPlace(destinationRef.current.value);
      store.setOriginPlace(originRef.current.value);
    }
  };

  const correctDistance = (distanceLat, distanceLng) => {
    // eslint-disable-next-line no-undef
    const latLng = new google.maps.LatLng(center.lat, center.lng);

    // eslint-disable-next-line no-undef
    const circle = new google.maps.Circle();
    circle.setCenter(latLng);
    circle.setRadius(10000);
    const bounds = circle.getBounds();
    const lngBound = bounds.getNorthEast().lng();

    const radiusCircle = Math.abs(center.lng - lngBound);

    const latVector = center.lat - distanceLat;
    const lngVector = center.lng - distanceLng;
    const radiusDistance = Math.sqrt(
      Math.pow(latVector, 2) + Math.pow(lngVector, 2)
    );

    return radiusCircle > radiusDistance ? true : false;
  };

  const fortmatTime = (duration) => {
    if (duration) {
      if (duration > 6000) {
        const minDuration = new Date(duration * 1000 - 600000);
        const minDurationHours = minDuration.getUTCHours();
        const minDurationMinutes = minDuration.getUTCMinutes();
        if (minDurationHours) {
          setMinDurationTime(`${minDurationHours}h ${minDurationMinutes}m`);
        } else {
          setMinDurationTime(`${minDurationMinutes}m`);
        }
      }

      const maxDuration = new Date(duration * 1000 + 600000);
      const maxDurationHours = maxDuration.getUTCHours();
      const maxDurationMinutes = maxDuration.getUTCMinutes();
      if (maxDurationHours) {
        setMaxDurationTime(`${maxDurationHours}h ${maxDurationMinutes}m`);
      } else {
        setMaxDurationTime(`${maxDurationMinutes}m`);
      }
    } else {
      setMinDurationTime(null);
      setMaxDurationTime(null);
      map.panTo(center);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setMinDurationTime(null);
    destinationRef.current.value = "";
    store.setDurationTime(null);
    store.setDestinationPlace("");
    store.setOriginPlace("");
  };

  return (
    <Container
      max="800px"
      sx={{
        display: "column",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Box
        sx={
          (desktop && {
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: "20px",
          }) ||
          (mobile && {
            display: "flex",
            justifyContent: "center",
            width: "100%",
            flexDirection: "column",
          })
        }
      >
        <Box
          sx={mobile ? { marginBottom: 1, width: "100%" } : { width: "350px" }}
        >
          <Autocomplete>
            <TextField
              sx={{ backgroundColor: "#fbf7f3" }}
              type="text"
              placeholder="Origin"
              hidden
              value={"Hesburger near Vul. Irpins'ka, Kyiv region"}
              inputRef={originRef}
              fullWidth
            />
          </Autocomplete>
        </Box>
        <Box
          sx={mobile ? { marginBottom: 1, width: "100%" } : { width: "350px" }}
        >
          <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
            <TextField
              sx={{ backgroundColor: "#fbf7f3" }}
              type="text"
              placeholder="Delivery address"
              inputRef={destinationRef}
              fullWidth
            />
          </Autocomplete>
        </Box>
      </Box>
      {alerError && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Alert severity="error">
            Delivery address is out of a delivery range
          </Alert>
        </Box>
      )}
      {maxDurationTime && !alerError && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              marginTop: 2,
              width: "300px",
              display: "flex",
              justifyContent: "flex-start",
              border: "2px solid #ad160c",
              borderRadius: "10px",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingLeft: "10px",
            }}
          >
            <Typography variant="body1" color="#ad160c">
              Will be delivered in:&nbsp;
              {minDurationTime} - {maxDurationTime}
            </Typography>
          </Box>
        </Box>
      )}

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <GoogleMap
          center={center}
          zoom={(desktop && 11) || (mobile && 10)}
          mapContainerStyle={
            (desktop && containerStyle) || (mobile && containerStyleMoblie)
          }
          onLoad={(map) => setMap(map)}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
          }}
        >
          <Circle options={optionsCircle} center={center} radius={10000} />
          <Marker position={center} icon={`images/FOODMARKER.png`} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </Container>
  );
};

export default observer(GoogleMapRender);
