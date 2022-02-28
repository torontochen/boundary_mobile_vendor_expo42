import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { Card } from "react-native-elements";
import { useQuery } from "@apollo/react-hooks"
// import { GET_ACTIVE_FLYER_LOCAL } from "../../queries/queries_query"
import { Switch } from "react-native-paper";
// import SimpleCouponScreen from "./SimpleCouponScreen";

const { height, width } = Dimensions.get("window");

const MailBagScreen = ({ navigation, route }) => {
  const { newFlyerList } = route.params
  const [simpleFlyerToPass, setSimpleFlyerToPass] = useState([])
  const [simpleCouponToPass, setSimpleCouponToPass] = useState([])
  const [multiCouponToPass, setMultiCouponToPass] = useState([])
  const [flyerCouponToPass, setFlyerCouponToPass] = useState([])

  // const { data: activeFlyerData } = useQuery(GET_ACTIVE_FLYER_LOCAL)
 
  useEffect(() => {
    // console.log(activeFlyerData.activeFlyer)

  if (newFlyerList.length > 0) {
    // console.log("mailbagscreen32")
    // console.log(newFlyerList)
    let simpleFlyer = [],simpleCoupon = [], multiCoupon = [],flyerCoupon =[]
    newFlyerList.map(flyer => {
      // console.log(flyer.promoInfo)
      switch (flyer.flyerType) {
        case "FLYER":
          simpleFlyer.push({
            vendor: flyer.businessTitle,
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
            vendor: flyer.businessTitle,
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
            vendor: flyer.businessTitle,
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
            vendor: flyer.businessTitle,
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
              navigation.navigate("CouponScreen", { couponPages: simpleFlyerToPass, title: "Simple Flyers" });
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
              navigation.navigate("CouponScreen", 
              { couponPages: simpleCouponToPass, title: "Simple Coupons" }
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
              navigation.navigate("CouponScreen", { couponPages: multiCouponToPass, title: "Multiple Coupons" });
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
              navigation.navigate("CouponScreen", { couponPages: flyerCouponToPass, title: "Flyers & Coupons" });
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

export default MailBagScreen;
