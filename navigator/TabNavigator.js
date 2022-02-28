import React, { useState, useEffect } from "react";
import { Alert } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, withBadge } from 'react-native-elements'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@apollo/react-hooks";

import CustomerStackNavigator from "./CustomerStackNavigator";
import OrderStackNavigator from "./OrderStackNavigator";
import ReportStackNavigator from "./ReportStackNavigator";
import AccountingStackNavigator from "./AccountingStackNavigator";
import themes from "../assets/themes";
import { GET_AUTH, GET_CURRENT_VENDOR } from "../queries/queries_query";
import Loading from './Loading'

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {
const { vendor } = props
console.log('vendor in TabNav', vendor)
// const [authed,setAuthed] = useState()
// const [vendor, setVendor] = useState()


const { data: authData } = useQuery(GET_AUTH);
const {
  auth: { isAuthed },
} = authData;
  // useEffect(()=>
  // {
 
  // setAuthed(isAuthed)},[authData])

// const { data: vendorData, loading} = useQuery(GET_CURRENT_VENDOR)
// console.log('vendorData', vendorData)

  // useEffect(() => {
  //   if(vendorData) {
  //     const { getCurentVendor} = vendorData
  //   setVendor(getCurentVendor)
  //   }
    
  // }, [vendorData])



     return (<Tab.Navigator
      lazy={true}
      screenOptions={({ route }) => ({
        tabBarLabel:() => {return null},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconReturned;
          switch (route.name) {
            case "Orders":
              iconName = focused ? "file-tray-full" : "file-tray-full-outline";
              iconReturned = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case "Customer":
              iconName = focused ? "md-people-sharp" : "md-people-outline";
              iconReturned = (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case "Accounting":
              iconName = focused ? "calculator-sharp" : "calculator-outline";
              // const BadgedIcon = withBadge(shoppingCartCount, 
              //                             {textStyle: {color: 'red', fontWeight: 'bold', fontSize: 12}, 
              //                             badgeStyle: {top: -10, left: -20}, status: ''})(Icon);

              // iconReturned = (
              //   shoppingCartCount > 0 && authed? 
              //   <BadgedIcon 
              //   type="material-community" 
              //   name={iconName} 
              //   size={size} 
              //   color={color}
              //   /> : 
              //   <MaterialCommunityIcons name={iconName} size={size} color={color} />
              // );
              iconReturned = (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case "Reports":
              iconName = focused ? "newspaper-sharp" : "newspaper-outline";
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
      {/* {loading&&<Loading/>} */}

     <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // console.log('isAuthed', isAuthed)
            if (!isAuthed) {
              e.preventDefault();
              // navigation.navigate("Login");
            }
          },
        })}
        initialParams={{vendor}}
      />
      <Tab.Screen 
        name="Customer" 
        component={CustomerStackNavigator}  
        initialParams={{vendor}}
        />
     
      <Tab.Screen
        name="Accounting"
        component={AccountingStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // console.log('isAuthed', isAuthed)
            if (!isAuthed) {
              e.preventDefault();
              navigation.navigate("Login");
            }
          },
        })}
        initialParams={{vendor}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!isAuthed) {
              e.preventDefault();
              navigation.navigate("Login");
            } 
          },
        })}
        initialParams={{vendor}}
      />
    </Tab.Navigator>)
   
};

export default TabNavigator;
