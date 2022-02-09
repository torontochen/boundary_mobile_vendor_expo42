import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.one}>
        {/* <Text>One</Text> */}
        <ImageBackground
          source={require("./assets/house3.jpg")}
          style={styles.image}
        />
      </View>
      <View style={styles.two}>
        {/* <Text>Two</Text> */}
        <View style={styles.twoChild1}>
          <Text>twoChild1</Text>
        </View>
        <View style={styles.twoChild2}>
          <Text style={{ textAlign: "center" }}>twoChild2</Text>
        </View>
        <View style={styles.twoChild3}>
          <Text>twoChild3</Text>
        </View>
      </View>
      <View style={styles.three}>
        <Text>Three</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    borderColor: "black",
    borderWidth: 1,
    marginTop: 30,
    // alignItems: "center",
    padding: 6,
    justifyContent: "center",
    borderRadius: 10,
    // overflow: "scroll",
  },
  one: {
    backgroundColor: "#AB47BC",
    justifyContent: "center",
    alignItems: "center",
    // height: "70%",
    flex: 1,
  },
  two: {
    backgroundColor: "#E1BEE7",
    height: "20%",
    // flex: 1,
    // flexDirection: "row",
    justifyContent: "center",
  },
  three: {
    backgroundColor: "#F06292",
    height: "10%",
    // flex: 1,
  },
  twoChild1: {
    backgroundColor: "#880E4F",
    alignSelf: "center",
    flex: 1,
    // height: "80%",
    width: "80%",
  },
  twoChild2: {
    backgroundColor: "#4A148C",
    // flex: 1,
    alignSelf: "center",
    width: "100%",
  },
  twoChild3: {
    backgroundColor: "#B71C1C",
    flex: 1,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "pink",
  },
  image: {
    flex: 1,
    // height: height / 3,
    // width: width - 50,
    // height: "50%",
    // width: "80%",
    resizeMode: "cover",
    justifyContent: "center",
  },
});
