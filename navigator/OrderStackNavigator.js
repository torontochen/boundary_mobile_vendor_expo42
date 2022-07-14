import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OrderScreen from "../screens/orderScreens/OrderScreen";
import SingleOrderScreen from "../screens/orderScreens/SingleOrderScreen";
import CheckoutScreen from "../screens/orderScreens/CheckoutScreen";


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
      <OrderStack.Screen name="Order" component={OrderScreen} initialParams={{vendor}}/>
      <OrderStack.Screen name="SingleOrder" component={SingleOrderScreen} initialParams={{vendor}}/>
      <OrderStack.Screen name="Checkout" component={CheckoutScreen} initialParams={{vendor}}/>
      {/* <OrderStack.Screen name="QrCodeScanner" component={QrCodeScanner} initialParams={{vendor}}/> */}
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
