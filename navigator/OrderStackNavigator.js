import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OrdersScreen from "../screens/orderScreens/OrdersScreen";
import SingleOrderScreen from "../screens/orderScreens/SingleOrderScreen";
// import StashScreen from "../screens/homeScreen/StashScreen";
// import GoldCoinScreen from "../screens/homeScreen/GoldCoinScreen";
// import MailBagScreen from "../screens/homeScreen/MailBagScreen";
// import SilverCoinScreen from "../screens/homeScreen/SilverCoinScreen";
// import CouponScreen from "../screens/homeScreen/CouponScreen";
// import CouponScreenStash from "../screens/homeScreen/CouponScreenStash";
// import SinglePageScreen from "../screens/homeScreen/SinglePageScreen"
// import JoinGuildScreen from "../screens/homeScreen/JoinGuildScreen"
// import StartGuildScreen from "../screens/homeScreen/StartGuildScreen"
// import MyGuildScreen from "../screens/homeScreen/MyGuildScreen"
// import GuildDealsScreen from "../screens/homeScreen/GuildDealsScreen"
// import OrderScreen from "../screens/homeScreen/OrderScreen"

import themes from "../assets/themes";

const OrderStack = createStackNavigator();

const OrderStackNavigator = ({route}) => {
  const { vendor } = route.params
  return (
    <OrderStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: themes.primary,
      }}
    >
      <OrderStack.Screen name="Order" component={OrdersScreen} initialParams={{vendor}}/>
      <OrderStack.Screen name="SingleOrder" component={SingleOrderScreen} initialParams={{vendor}}/>
      {/* <HomeStack.Screen name="Stash" component={StashScreen} />
      <HomeStack.Screen name="MailBag" component={MailBagScreen} />
      <HomeStack.Screen name="GoldCoin" component={GoldCoinScreen} />
      <HomeStack.Screen name="SilverCoin" component={SilverCoinScreen} />
      <HomeStack.Screen name="CouponScreen" component={CouponScreen} />
      <HomeStack.Screen name="CouponScreenStash" component={CouponScreenStash} />
      <HomeStack.Screen name="SinglePageReview" component={SinglePageScreen} />
      <HomeStack.Screen name="JoinGuild" component={JoinGuildScreen} />
      <HomeStack.Screen name="StartGuild" component={StartGuildScreen} />
      <HomeStack.Screen name="MyGuild" component={MyGuildScreen} />
      <HomeStack.Screen name="GuildDeals" component={GuildDealsScreen} />
      <HomeStack.Screen name="Order" component={OrderScreen} /> */}
    </OrderStack.Navigator>
  );
};

export default OrderStackNavigator;
