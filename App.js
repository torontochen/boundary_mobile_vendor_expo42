import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import { StyleSheet, SafeAreaView, LogBox } from "react-native";
import { Container } from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import AppNavigator from "./navigator/AppNavigator";

import clientLink from "./clientLink";

// import FingerprintJS from "@fingerprintjs/fingerprintjs";

const fetchFonts = () => {
  return Font.loadAsync({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
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
    fontFamily: "Roboto_medium",
    fontSize: 50,
  },
});
