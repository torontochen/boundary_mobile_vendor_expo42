import React, { useState, useEffect } from "react";
import { Alert } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, withBadge } from 'react-native-elements'
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@apollo/react-hooks";

import MainStackNavigator from "./MainStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import ChatStackNavigator from "./ChatStackNavigator";
import CartStackNavigator from "./CartStackNavigator";
import themes from "../assets/themes";
import { GET_AUTH, GET_CURRENT_RESIDENT, GET_SHOPPING_CART_COUNT, GET_GUILD_ENROLLED } from "../queries/queries_query";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {


const [authed,setAuthed] = useState()
const [shoppingCartCount, setShoppingCartCount] = useState(0)

// useEffect(() => {

//   const BadgedIcon = withBadge(shoppingCartCount, {textStyle: {color: 'red', fontWeight: 'bold', fontSize: 15}, badgeStyle: {top: -15, left: -5}, status: ''})(Icon);
// }, [shoppingCartCount])

const { data: authData } = useQuery(GET_AUTH);

  useEffect(()=>
  {
  const {
    auth: { isAuthed },
  } = authData;
  setAuthed(isAuthed)},[authData])

const { data: countData} = useQuery(GET_SHOPPING_CART_COUNT)

  useEffect(() => {
    const { shoppingCartCount: {count}} = countData
    setShoppingCartCount(count)
  }, [countData])



// useEffect(() => {

//   DeviceEventEmitter.addListener('updateShoppingCart', value => {
//   console.log('shoppingCartCount',value.count)
//   setShoppingCartCount(value.count)
// })
//   return () => {
//     DeviceEventEmitter.removeListener('updateShoppingCart')
//   }
// }, [])
// const { data: residentData, loading, error } = useQuery(GET_CURRENT_RESIDENT)
// const { data: cartData, loading: cartLoading, error: cartError } = useQuery(GET_SHOPPING_CART, { variables: { resident: residentName}})



  return (
    <Tab.Navigator
      lazy={true}
      screenOptions={({ route }) => ({
        tabBarLabel:() => {return null},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconReturned;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              iconReturned = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case "DashBoard":
              iconName = focused ? "view-dashboard" : "view-dashboard-outline";
              iconReturned = (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              const BadgedIcon = withBadge(shoppingCartCount, 
                                          {textStyle: {color: 'red', fontWeight: 'bold', fontSize: 12}, 
                                          badgeStyle: {top: -10, left: -20}, status: ''})(Icon);

              iconReturned = (
                shoppingCartCount > 0 && authed? 
                <BadgedIcon 
                type="material-community" 
                name={iconName} 
                size={size} 
                color={color}
                /> : 
                <MaterialCommunityIcons name={iconName} size={size} color={color} />
              );
              break;
            case "Chat":
              iconName = focused ? "md-chatbubbles-sharp" : "md-chatbubbles-outline";
              iconReturned = (
                <Ionicons name={iconName} size={size} color={color} />
              );
          }

          // if (route.name === "Home") {
          //   ;
          // } else if (route.name === "Settings") {
          //   iconName = focused ? "ios-list-box" : "ios-list";
          // }
          return iconReturned;
        },
      })}
      tabBarOptions={{
        activeTintColor: themes.primary,
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="DashBoard" component={MainStackNavigator} />
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // console.log('isAuthed', isAuthed)
            if (!authed) {
              e.preventDefault();
              navigation.navigate("Login");
            }
          },
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // console.log('isAuthed', isAuthed)
            if (!authed) {
              e.preventDefault();
              navigation.navigate("Login");
            }
          },
        })}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!authed) {
              e.preventDefault();
              navigation.navigate("Login");
            } 
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
