import React, { useEffect, useState } from "react";
import { Spinner } from "native-base";
import { StyleSheet, Dimensions, View } from "react-native";

import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useQuery } from "@apollo/react-hooks";

import { GET_INIT_LOCATION } from "../queries/queries_query";

const { height, width } = Dimensions.get("window");

const Map = (props) => {
  const {
    onSelectPostalCode,
    onSelectInitialLat,
    onSelectInitialLng,
    initialLat,
    initialLng,
  } = props;

  const { data } = useQuery(GET_INIT_LOCATION);
  const {
    initLocation: { initLat, initLng },
  } = data;

  const [isFetching, setIsFetching] = useState(false);
  // const [initLat, setInitLat] = useState();
  // const [initLng, setInitLng] = useState();
  const [region, setRegion] = useState();
  const [markerCoords, setMarkerCoords] = useState();
  const [pickedLocation, setPickedLocation] = useState();
  // let markerCoords;

  useEffect(() => {
    if (initialLat && initialLng) {
      // setRegion({
      //   latitude: initialLat,
      //   longitude: initialLng,
      //   latitudeDelta: 0.05,
      //   longitudeDelta: 0.115,
      // });
      // console.log("initialLat");
      setMarkerCoords({
        latitude: initialLat,
        longitude: initialLng,
      });
    }
  }, []);

  const pickLocationHandler = (locationDetails) => {
    const {
      geometry: { location },
      name,
    } = locationDetails;
    // console.log(locationDetails);
    onSelectPostalCode(name);
    onSelectInitialLat(location.lat);
    onSelectInitialLng(location.lng);
    // console.log(location);
    setPickedLocation({ lat: location.lat, lng: location.lng });
    // if (location) {
    //   markerCoords = { latitude: location.lat, longitude: location.lng };
    // }
    // console.log(markerCoords);
  };

  useEffect(() => {
    if (pickedLocation) {
      setMarkerCoords({
        latitude: pickedLocation.lat,
        longitude: pickedLocation.lng,
      });
    }
  }, [pickedLocation]);

  // const verifyPermissions = async () => {
  //   const result = await Permissions.askAsync(Permissions.LOCATION);
  //   if (result.status !== "granted") {
  //     Alert.alert(
  //       "Insufficient permissions!",
  //       "You need to grant location permissions to use this app.",
  //       [{ text: "Okay" }]
  //     );
  //     return false;
  //   }
  //   return true;
  // };

  // const getInitLocation = async () => {
  //   const hasPermission = await verifyPermissions();
  //   if (!hasPermission) {
  //     return;
  //   }
  //   try {
  //     setIsFetching(true);
  //     const location = await Location.getCurrentPositionAsync({
  //       // timeout: 5000,
  //     });
  //     console.log(location);
  //     if (
  //       initLat != location.coords.latitude ||
  //       initLng != location.coords.longitude
  //     ) {
  //       setInitLat(location.coords.latitude);
  //       setInitLng(location.coords.longitude);
  //     }

  //     //   props.onLocationPicked({
  //     //     lat: location.coords.latitude,
  //     //     lng: location.coords.longitude
  //     //   });
  //   } catch (err) {
  //     Alert.alert(
  //       "Could not fetch location!",
  //       "Please try again later or pick a location on the map.",
  //       [{ text: "Okay" }]
  //     );
  //   }
  //   setIsFetching(false);
  // };

  // useEffect(() => {
  //   getInitLocation();
  // }, []);

  useEffect(() => {
    // console.log(initLat);
    // console.log(initLng);
    if (pickedLocation) {
      // console.log("1");
      setRegion({
        latitude: pickedLocation.lat,
        longitude: pickedLocation.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.115,
      });
    } else if (initialLat && initialLng) {
      // console.log("2");
      setRegion({
        latitude: initialLat,
        longitude: initialLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.115,
      });
    } else if (initLat && initLng) {
      // console.log("3");
      setRegion({
        latitude: initLat,
        longitude: initLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.115,
      });
    }

    // console.log(region);
  }, [initLat, initLng, pickedLocation, initialLat, initialLng]);

  return (
    <View
      style={{
        justifyContent: "flex-start",
        // backgroundColor: "red",
        height: height / 3.5,
      }}
    >
      {isFetching && <Spinner />}
      {initLng && initLat && (
        <MapView
          region={region}
          provider={"google"}
          style={{ ...styles.mapView, ...props.mapStyle }}
        >
          {markerCoords && (
            <Marker
              title="My Home"
              coordinate={markerCoords}
              image={require("../assets/houseMarker.png")}
            />
          )}
        </MapView>
      )}
      {!isFetching && (
        <GooglePlacesAutocomplete
          style={{ ...styles.autoComplete, ...props.mapStyle }}
          placeholder="Postcode of Residence or Workplace in GTA"
          // isRowScrollable={true}
          keyboardShouldPersistTaps="always"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // console.log(data, details);
            pickLocationHandler(details);
          }}
          query={{
            key: "AIzaSyCTfhqqmfFA7bt0U730HQvLhGWxy6rSLys",
            language: "en",
          }}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              backgroundColor: "white",
              borderBottomColor: "#E0E0E0",
              borderBottomWidth: 1,
              width: width - 100,
            },
            textInput: {
              height: 25,
              color: "#6F5FC6",
              fontSize: 12,
            },
            listView: {
              zIndex: 100,
            },

            // row: {
            //   backgroundColor: "#FFFFFF",
            //   padding: 8,
            //   height: 30,
            //   flexDirection: "row",
            // },
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapView: {
    width: width - 100,
    height: height / 6,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 5,
    shadowColor: "#212121",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  autoComplete: {
    width: width - 80,
    height: 25,
    alignSelf: "center",
  },
});

export default Map;
