import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountingScreen from "../screens/accountingScreens/AccountingScreen";

import themes from "../assets/themes";

const AccountingStack = createStackNavigator()

const AccountingStackNavigator = ({ route }) => {
    const { vendor } = route.params
    return (
        <AccountingStack.Navigator
        screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: themes.primary,
          }}
        >
            <AccountingStack.Screen name='Accounting' component={AccountingScreen} initialParams={{currentVendor: vendor}}/>
        
        </AccountingStack.Navigator>
    )}
export default AccountingStackNavigator