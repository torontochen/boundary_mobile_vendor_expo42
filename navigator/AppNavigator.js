import React, {useState, useEffect} from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";

import StartupScreen from "../screens/StartupScreen";
import TabNavigator from "./TabNavigator";
import Loading from "./Loading";

import {
  GET_AUTH,
  GET_INIT_LOCATION,
  GET_LANDING_PAGE_SHOWED,
  GET_CURRENT_VENDOR
} from "../queries/queries_query";

const AppNavigator = (props) => {

  const [authed, setAuthed] = useState()

  const { data: authData } = useQuery(GET_AUTH);
  const { data: locationData } = useQuery(GET_INIT_LOCATION);
  const { data: landingPageData } = useQuery(GET_LANDING_PAGE_SHOWED);
  // const [getCurrentVendor, {loading} ]=  useLazyQuery(GET_CURRENT_VENDOR,{
  //   async onCompleted({getCurrentVendor}) {
  //     console.log('getCurrentVendor', getCurrentVendor)
  //     setVendor(getCurrentVendor)
  //   }
  // })
  const { data: vendor, loading} = useQuery(GET_CURRENT_VENDOR)

  const {
    auth: { isAuthed },
  } = authData;
  console.log('isauthed in appnav', isAuthed)
  // useEffect( ()=>{
  //   console.log('get current vendor')
  //  setAuthed(isAuthed)
  // //  return () => {
  // //    setVendor()
  // //  }
  // },[isAuthed])
  // useEffect(() => {setAuthed(isAuthed)},[isAuthed])

  // useEffect(() => {
  //   // if (listenerNo == 0) {
  //      DeviceEventEmitter.addListener('authed', value => {
  //     // const { itemLoaded } = value
  //     // console.log('itemLoaded', itemLoaded)
  //     //   const items = [...shoppingCartItems]
  //     //   items.push(itemLoaded)
  //     //   setShoppingCartItems(items)
  //     //   const qty = [...quantity]
  //     //   qty.push(itemLoaded.quantity.toString())
  //     //   setQuantity(qty)
  //     // if(residentName) {
  //     //    getShoppingCart({ variables: { resident: residentName}})
  //     // }
      
  //      setAuthed(value.authed)
  //   })
  // // setListenerNo(1)
  //   // }
 
  //   return () => {
  //     DeviceEventEmitter.removeListener('authed')
  //   }
  // }, [])
  const {
    initLocation: { initLat, initLng },
  } = locationData;
  const {
    landingPageShowed: { showed },
  } = landingPageData;
  // const { getCurrentVendor } = vendorData
  // console.log('getCurrentVendor', getCurrentVendor)
  // console.log(showed);
  // console.log(isAuthed);
  return (
    <NavigationContainer>
      {/* {initLat != 0 && initLng != 0 && showed && <TabNavigator />} */}
      {/* {!isAuthed && (initLat == 0 || initLng == 0 || !showed) && (
        <StartupScreen />
      )} */}

      {isAuthed&&vendor&&vendor.getCurrentVendor&&<TabNavigator vendor={vendor.getCurrentVendor}/>}
      {/* {isAuthed&&loading&&<Loading />} */}
      {!isAuthed && (
        <StartupScreen />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
