import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ShoppingCartScreen from '../screens/vendorInterface/ShoppingCartScreen'
import CheckoutScreen from '../screens/vendorInterface/CheckoutScreen'

import themes from "../assets/themes";

const CartStack = createStackNavigator()

const CartStackNavigator = () => {
    return (
        <CartStack.Navigator
        screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: themes.primary,
          }}
        >
            <CartStack.Screen name='ShoppingCart' component={ShoppingCartScreen}/>
        
            <CartStack.Screen name='Checkout' component={CheckoutScreen}/>
        </CartStack.Navigator>
    )
}

export default CartStackNavigator