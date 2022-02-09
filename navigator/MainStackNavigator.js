import React, { useEffect, useRef } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { Icon, Text } from "react-native-elements";

import themes from "../assets/themes";
import DashBoardScreen from "../screens/dashBoardScreen/DashBoardScreen";
import ProfileScreen from "../screens/dashBoardScreen/ProfileScreen";
import LoginScreen from "../screens/dashBoardScreen/LoginScreen";
import InitialLocationScreen from "../screens/dashBoardScreen/InitialLocationScreen";
import VendorInterfaceScreen from "../screens/dashBoardScreen/VendorInterfaceScreen";
import SingleItemScreen from "../screens/vendorInterface/SingleItemScreen";
// import { Text } from "native-base";


const MainStack = createStackNavigator();

const MainStackNavigator = ({ navigation }) => {
  const rightIcon = useRef(null);

  const hideMenu = () => {
    rightIcon.current.hide();
  };

  const showMenu = () => {
    rightIcon.current.show();
  };

  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: themes.primary,
      }}
    >
      <MainStack.Screen name="DashBoard" component={DashBoardScreen} />
      <MainStack.Screen name="Login" component={LoginScreen} />
      <MainStack.Screen 
        name="VendorInterface" 
        component={VendorInterfaceScreen} 
        options={({ route }) => ({
          title: route.params.vendor
        })}
        />
      <MainStack.Screen 
        name="SingleItem"
        component={SingleItemScreen}
        options={({route}) => ({
          // headerTitle: () => {
          //   return (
          //     <Text
          //       numberOfLines={1}
          //       ellipsizeMode='tail'
          //       >{route.params.singleItem.description}</Text>
          //   )
          // } ,
          title: route.params.singleItem.description
        })}
      />
      <MainStack.Screen
        name="Initial Location"
        component={InitialLocationScreen}
        options={{ headerLeft: null }}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerLeft: null }}
      />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
