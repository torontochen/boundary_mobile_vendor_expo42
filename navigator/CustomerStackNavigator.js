import React, { useEffect, useRef } from "react";

import { createStackNavigator } from "@react-navigation/stack";
// import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { Icon, Text } from "react-native-elements";

import themes from "../assets/themes";
import CustomerScreen from "../screens/customerScreens/CustomerScreen";
// import ProfileScreen from "../screens/dashBoardScreen/ProfileScreen";
// import LoginScreen from "../screens/dashBoardScreen/LoginScreen";
// import InitialLocationScreen from "../screens/dashBoardScreen/InitialLocationScreen";
// import VendorInterfaceScreen from "../screens/dashBoardScreen/VendorInterfaceScreen";
// import SingleItemScreen from "../screens/vendorInterface/SingleItemScreen";
// import { Text } from "native-base";


const CustomerStack = createStackNavigator();

const CustomerStackNavigator = ({ navigation, route }) => {
  const {vendor} = route.params
  console.log(('vendor', vendor))
  const rightIcon = useRef(null);

  const hideMenu = () => {
    rightIcon.current.hide();
  };

  const showMenu = () => {
    rightIcon.current.show();
  };

  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: themes.primary,
        title: 'Customer Messages'
      }}
    >
      <CustomerStack.Screen name="CustomerMsg" component={CustomerScreen} initialParams={{vendor}} />
      {/* <CustomerStack.Screen name="Login" component={LoginScreen} />
      <CustomerStack.Screen 
        name="VendorInterface" 
        component={VendorInterfaceScreen} 
        options={({ route }) => ({
          title: route.params.vendor
        })}
        />
      <CustomerStack.Screen 
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
      <CustomerStack.Screen
        name="Initial Location"
        component={InitialLocationScreen}
        options={{ headerLeft: null }}
      />
      <CustomerStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerLeft: null }}
      /> */}
    </CustomerStack.Navigator>
  );
};

export default CustomerStackNavigator;
