import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";

import StartupScreen from "../screens/StartupScreen";
import TabNavigator from "./TabNavigator";

import {
  GET_AUTH,
  GET_INIT_LOCATION,
  GET_LANDING_PAGE_SHOWED,
} from "../queries/queries_query";

const AppNavigator = (props) => {
  const { data: authData } = useQuery(GET_AUTH);
  const { data: locationData } = useQuery(GET_INIT_LOCATION);
  const { data: landingPageData } = useQuery(GET_LANDING_PAGE_SHOWED);

  const {
    auth: { isAuthed },
  } = authData;
  const {
    initLocation: { initLat, initLng },
  } = locationData;
  const {
    landingPageShowed: { showed },
  } = landingPageData;
  // console.log(showed);
  // console.log(isAuthed);
  return (
    <NavigationContainer>
      {initLat != 0 && initLng != 0 && showed && <TabNavigator />}
      {!isAuthed && (initLat == 0 || initLng == 0 || !showed) && (
        <StartupScreen />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
