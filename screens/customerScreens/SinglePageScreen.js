import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import {  Icon, Card, Button, Overlay, Badge, FAB} from "react-native-elements"
import QRCode from 'react-native-qrcode-svg'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useIsFocused } from '@react-navigation/native'


import themes from "../../assets/themes";

const { height, width } = Dimensions.get("window");

const SinglePageScreen = ({navigation, route}) => {
 const[isQrScanOpen, setIsQrScanOpen] = useState(false)
  const { pageToReview: {base64, flyerType, couponType, vendor, flyerId, couponId, width: pageWidth, height: pageHeight} } = route.params
  // console.log(route.params)


  // console.log(couponType)
  if(flyerType=="COUPON" || flyerType=="MULTICOUPON" || couponType=="COUPONPAGE") {
     return (
      //  <ScrollView horizontal={true}>
      <View style={styles.pageContainer}>
          

        <Card style={styles.cardStyle}>
          <Card.Title>
            {/* <TouchableOpacity style={{position: "relative", top: 10, left: 10}}>
              <Icon
                  name="qrcode"
                  type="font-awesome-5"
                  size={24}
                  color="green"
                  raised
                  
                  onPress={()=> {
                    // console.log("qr code")
                    setIsQrScanOpen(true)
                  }}
                />
            </TouchableOpacity> */}
            <FAB 
              icon={{
                  name: "qrcode",
                  type: "font-awesome-5",
                  color: "#3949AB",
                  size: 28
              }}
              buttonStyle={{backgroundColor: "white", width: 36, height: 36}}
              onPress={()=> {
                  setIsQrScanOpen(true)
                }}
              />
          </Card.Title> 
            <Card.Image
              source={{uri: 'data:image/jpeg;base64,' + base64}}
              style={{
                width: pageWidth * 0.8, 
                height: pageHeight, 
                margin: 30
              }}
              resizeMode="contain"
            >
          </Card.Image>
          
        </Card>

        <Overlay 
          isVisible={isQrScanOpen}
          onBackdropPress={()=>{
            setIsQrScanOpen(false)
          }}
          overlayStyle={styles.overlayStyle}
        >
            <QRCode
              value={flyerId+":"+vendor+":"+couponId}
              size={250}
            />
        </Overlay>
      </View>
    )
  } else {
     return (
      <View style={styles.pageContainer}>
        <Card style={styles.cardStyle}>
          <Card.Image
            source={{uri: 'data:image/jpeg;base64,' + base64}}
            style={{
              width: pageWidth * 0.8, 
              height: pageHeight, 
              margin: 50
            }}
            resizeMode="contain"
            >
          </Card.Image>
        </Card>

        <Overlay 
          isVisible={isQrScanOpen}
          onBackdropPress={()=>{
            setIsQrScanOpen(false)
          }}
          overlayStyle={styles.overlayStyle}
        >
          
            <QRCode
              value={flyerId+":"+vendor+":"+couponId}
              size={250}
              
            />
        </Overlay>
      </View>
    );

  }
   
  };

const styles = StyleSheet.create({

  pageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "baseline",
    width: width,
    marginVertical: 5,
    transform: [{ rotate: '270deg'}]
  },

  cardStyle: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },

  overlayStyle: {
    opacity: 1,

  }

});
export default SinglePageScreen;
