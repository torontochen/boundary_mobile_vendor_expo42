import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import { StyleSheet, SafeAreaView, LogBox } from "react-native";
import { Container } from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { setCustomText } from 'react-native-global-props'
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black,
  Montserrat_900Black_Italic 
} from "@expo-google-fonts/montserrat";



import AppNavigator from "./navigator/AppNavigator";
import clientLink from "./clientLink";

// import FingerprintJS from "@fingerprintjs/fingerprintjs";

const fetchFonts = () => {
  return Font.loadAsync({
    mr300: Montserrat_300Light,
    mr400: Montserrat_400Regular,
    mr800: Montserrat_800ExtraBold,
    mr700: Montserrat_700Bold,
    mr900: Montserrat_900Black,
    ...Ionicons.font,
  });
};

export default function App() {
  useEffect(() => {
    // LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreAllLogs();
  }, []);

  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  } else {
    setCustomText( {style: { fontFamily: 'mr400', color: "#5C6BC0"}})
  }

  return (
    <ApolloProvider client={clientLink}>
      {/* <SafeAreaView style={styles.container}> */}
      <Container>
        <AppNavigator />
      </Container>
      {/* </SafeAreaView> */}
    </ApolloProvider>
  );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "mr400",
    fontSize: 50,
  },
});
