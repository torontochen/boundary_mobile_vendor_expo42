import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GoldCoinScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Gold Coin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default GoldCoinScreen;
