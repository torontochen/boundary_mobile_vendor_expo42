import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SilverCoinScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Silver Coin</Text>
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

export default SilverCoinScreen;
