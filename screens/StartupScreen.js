import React, { useEffect } from "react";
import { StatusBar, StyleSheet, Text, Alert } from "react-native";
import { Container, Spinner } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/react-hooks";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import {
  SET_INIT_LOCATION,
  SET_LANDING_PAGE_SHOWED,
  SET_AUTH,
} from "../queries/queries_mutation";

export default function StartupScreen(props) {
  // const navigation = useNavigation();
  // console.log(props.navigation);
  const [setInitLocation] = useMutation(SET_INIT_LOCATION);
  const [setLandingPageShowed] = useMutation(SET_LANDING_PAGE_SHOWED);
  const [setAuth] = useMutation(SET_AUTH);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: "Okay" }]
      );

      return false;
    }
    return true;
  };

  const getInitLocation = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        // timeout: 5000,
      });
      // console.log(location);
      if (location) {
        setInitLocation({
          variables: {
            initLat: location.coords.latitude,
            initLng: location.coords.longitude,
          },
        });
      }

      //   props.onLocationPicked({
      //     lat: location.coords.latitude,
      //     lng: location.coords.longitude
      //   });
    } catch (err) {
      Alert.alert("Could not fetch location!"," ", [{ text: "Okay" }]);
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  const _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("token");
    console.log('userToken',userToken)
    if (userToken) {
      setAuth({ variables: { isAuthed: true } });
    } else {
      setAuth({ variables: { isAuthed: false } });
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // props.navigation.navigate("DashBoard", {
    //   isAuthed: userToken ? true : false,
    // });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // async function something() {
  //     console.log("this might take some time....");
  //     await delay(5000);
  //     console.log("done!")
  // }

  const deferLandingPage = async () => {
    await delay(3000);
    setLandingPageShowed({ variables: { showed: true } });
  };

  useEffect(() => {
    _bootstrapAsync();
    getInitLocation();
    deferLandingPage();
  }, []);

  return (
    <Container style={styles.screen}>
      <Text style={styles.text}>Start Up</Text>
      <Spinner />
      <StatusBar barStyle="default" />
    </Container>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto_medium",
    fontSize: 18,
  },
});
