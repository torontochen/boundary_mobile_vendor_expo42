import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { Card } from "react-native-elements"

const { height, width } = Dimensions.get("window");

const StashScreen = ({ navigation, route }) => {
  const { stashedFlyers } = route.params
  // console.log("stashscreen10")
  // console.log(stashedFlyers)
  const [simpleFlyerToPass, setSimpleFlyerToPass] = useState([])
  const [simpleCouponToPass, setSimpleCouponToPass] = useState([])
  const [multiCouponToPass, setMultiCouponToPass] = useState([])
  const [flyerCouponToPass, setFlyerCouponToPass] = useState([])

  // const { data: activeFlyerData } = useQuery(GET_ACTIVE_FLYER_LOCAL)
 
  useEffect(() => {
    // console.log(activeFlyerData.activeFlyer)

  if (stashedFlyers.length > 0) {
    // console.log(stashedFlyers)
    let simpleFlyer = [],simpleCoupon = [], multiCoupon = [],flyerCoupon =[]
    stashedFlyers.map(flyer => {
      // console.log(flyer.promoInfo)
      switch (flyer.flyerType) {
        case "FLYER":
          simpleFlyer.push({
            vendor: flyer.vendor,
            logo: flyer.logo,
            flyerId: flyer.flyerId,
            flyerTitle: flyer.flyerTitle,
            flyerType: flyer.flyerType,
            dateFrom: flyer.dateFrom,
            dateTo: flyer.dateTo
          })
          break;
        case "COUPON":
          simpleCoupon.push({
            vendor: flyer.vendor,
            logo: flyer.logo,
            flyerId: flyer.flyerId,
            flyerTitle: flyer.flyerTitle,
            flyerType: flyer.flyerType,
            promoInfo: flyer.promoInfo,
            dateFrom: flyer.dateFrom,
            dateTo: flyer.dateTo
          })
          break;
        case "MULTICOUPON":
          multiCoupon.push({
            vendor: flyer.vendor,
            logo: flyer.logo,
            flyerId: flyer.flyerId,
            flyerTitle: flyer.flyerTitle,
            flyerType: flyer.flyerType,
            promoInfo: flyer.promoInfo,
            dateFrom: flyer.dateFrom,
            dateTo: flyer.dateTo
          })
          break;
        case "FLYERCOUPON":
          flyerCoupon.push({
            vendor: flyer.vendor,
            logo: flyer.logo,
            flyerId: flyer.flyerId,
            flyerTitle: flyer.flyerTitle,
            flyerType: flyer.flyerType,
            promoInfo: flyer.promoInfo,
            dateFrom: flyer.dateFrom,
            dateTo: flyer.dateTo
          })
          break;
      }
  })

      setSimpleFlyerToPass(simpleFlyer)
      setSimpleCouponToPass(simpleCoupon)
      setMultiCouponToPass(multiCoupon)
      setFlyerCouponToPass(flyerCoupon)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => {
            // console.log(simpleFlyerToPass)
            if (simpleFlyerToPass.length > 0) {
              navigation.navigate("CouponScreenStash", { originalCouponPagesStashed: simpleFlyerToPass, title: "Simple Flyers Stashed" });
            } else {
              Alert.alert("No Simple Flyer", " ", [{ text: "OK" }])
            }

          }}
        >
          <Card containerStyle={styles.card} wrapperStyle={styles.wrapper}>
            <Card.Title>Simple Flyer</Card.Title>
            <Card.Image
              source={require("../../assets/simpleFlyer.png")}
              style={styles.image}
            ></Card.Image>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // console.log(simpleCouponToPass)
            if (simpleCouponToPass.length > 0) {
              navigation.navigate("CouponScreenStash", 
              { originalCouponPagesStashed: simpleCouponToPass, title: "Simple Coupons Stashed" }
              );
            } else {
              Alert.alert("No Simple Coupon", " ", [{ text: "OK" }])
            }
          }}
        >
          <Card containerStyle={styles.card}>
            <Card.Title>Simple Coupon</Card.Title>
            <Card.Image
              source={require("../../assets/simpleCoupon.png")}
              style={styles.image}
            ></Card.Image>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => {
            if (multiCouponToPass.length > 0) {
              navigation.navigate("CouponScreenStash", { originalCouponPagesStashed: multiCouponToPass, title: "Multiple Coupons Stashed" });
            } else {
              Alert.alert("No Multiple Coupon", " ", [{ text: "OK" }])
            }
          }}
        >
          <Card containerStyle={styles.card}>
            <Card.Title>MultiCoupon</Card.Title>
            <Card.Image
              source={require("../../assets/multiCoupon.png")}
              style={styles.image}
            ></Card.Image>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (flyerCouponToPass.length > 0) {
              navigation.navigate("CouponScreenStash", { originalCouponPagesStashed: flyerCouponToPass, title: "Flyers & Coupons Stashed" });
            } else {
              Alert.alert("No FlyerCoupon", " ", [{ text: "OK" }])
            }
          }}
        >
          <Card containerStyle={styles.card}>
            <Card.Title>Flyer Coupon</Card.Title>
            <Card.Image
              source={require("../../assets/flyerCoupon.png")}
              style={styles.image}
            ></Card.Image>
          </Card>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: 15,
    // padding: 5,
  },
  card: {
    borderRadius: 5,
    shadowColor: "#212121",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  wrapper: {
    width: "100%",
    // height: "100%",
  },
  image: {
    height: width / 5,
    width: width / 3,
    marginVertical: 5,
    resizeMode: "stretch",
  },
});

export default StashScreen;
