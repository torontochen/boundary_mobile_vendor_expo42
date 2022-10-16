import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, Alert, View, ActivityIndicator, TouchableWithoutFeedback, Dimensions, Keyboard, DeviceEventEmitter } from "react-native";
import { Image, Input, Button  } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import * as Location from "expo-location";

import {
  SET_INIT_LOCATION,
  SET_LANDING_PAGE_SHOWED,
  SET_AUTH,
  SIGNIN_VENDOR,
  SET_AUTH_ERROR
} from "../queries/queries_mutation";
import { GET_CURRENT_VENDOR, GET_AUTH } from "../queries/queries_query";
import { GET_AUTH_ERROR } from "../queries/queries_query";
import themes from "../assets/themes";

const { width, height } = Dimensions.get("window");

export default function StartupScreen(props) {
  // const navigation = useNavigation();
  // console.log(props.navigation);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [vendor, setVendor] = useState()


  const [setInitLocation] = useMutation(SET_INIT_LOCATION);
  const [setLandingPageShowed] = useMutation(SET_LANDING_PAGE_SHOWED);
  const [setAuth] = useMutation(SET_AUTH, {
    refetchQueries: [{query: GET_CURRENT_VENDOR}],
    awaitRefetchQueries: true
  });

  const verifyPermissions = async () => {
    // const result = await Permissions.askAsync(Permissions.LOCATION);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: "Okay" }]
      );

      return false;
    }
    return true;
  };

  const [setAuthError] = useMutation(SET_AUTH_ERROR);
  const { data } = useQuery(GET_AUTH_ERROR);
  const {
      authError: { errMsg },
  } = data;

  const getInitLocation = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        // timeout: 5000,
      });
      // console.log(location);
      if (location) {
        setInitLocation({
          variables: {
            initLat: location.coords.latitude,
            initLng: location.coords.longitude,
          },
        });
      }

      //   props.onLocationPicked({
      //     lat: location.coords.latitude,
      //     lng: location.coords.longitude
      //   });
    } catch (err) {
      Alert.alert("Could not fetch location!"," ", [{ text: "Okay" }]);
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  const _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("vendorToken");
    console.log('userToken',userToken)
    if (userToken) {
      // useLazyQuery(getCurrentVendor)
      setAuth({ variables: { isAuthed: true } });
      // getCurrentVendor()
      // DeviceEventEmitter.emit('authed', {authed : true})
    } else {
      setAuth({ variables: { isAuthed: false } });
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // props.navigation.navigate("DashBoard", {
    //   isAuthed: userToken ? true : false,
    // });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // async function something() {
  //     console.log("this might take some time....");
  //     await delay(5000);
  //     console.log("done!")
  // }
  // const [getCurrentVendor, {loading: vendorLoading }] = useLazyQuery(GET_CURRENT_VENDOR, {
  //    async onCompleted({getCurrentVendor}) {
  //      console.log('getCurrentVendor', getCurrentVendor)
  //      if(getCurrentVendor) {
  //        setAuth({ variables: { isAuthed: true } });
  //      }
       
  //      setVendor(getCurrentVendor)
  //    }
  // })

  // useEffect(()=>{
  //   if(vendor) {
      
  //   }
    
  // },[vendor])
    // Signing In
    const [signinVendor, {loading: signinLoading}] = useMutation(SIGNIN_VENDOR, {
      async onCompleted({ signinVendor }) {
        console.log("signIn");
        const { token } = signinVendor;
        try {
          await AsyncStorage.setItem("vendorToken", token);
          setAuth({ variables: { isAuthed: true } });

          // DeviceEventEmitter.emit('authed', {authed : true})
           
          // setIsAuthed(!isAuthed)
          // navigation.replace('Order')
        } catch (err) {
          console.log(err.message);
        }
        // getCurrentVendor()
      },
      async onError(error) {
        console.log({ error });
        const loc = error.message.indexOf(":");
        const msg = error.message.slice(loc + 1);
        setAuthError({ variables: { errMsg: msg } });
      },
    });

    // useEffect(()=>{
    //   getCurrentVendor()
    // },[isAuthed])

  const deferLandingPage = async () => {
    await delay(3000);
    setLandingPageShowed({ variables: { showed: true } });
  };
  
  const { data: authData } = useQuery(GET_AUTH);
  const {
    auth: { isAuthed },
  } = authData;
// console.log('isauthed', isAuthed)

  useEffect(() => {
    _bootstrapAsync();
    getInitLocation();
    deferLandingPage();
    return () => {
      setEmail()
      setPassword()
    }
  }, []);

  return (
    <>
      {/* <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' /> */}
      {/* <View> */}
            <TouchableWithoutFeedback
            // style={styles.keyboardViewContainer}
            onPress={() => {
                Keyboard.dismiss();
            }}
            >
            <View style={styles.container}>
                {errMsg !== "" && (
                <View
                    style={styles.errorMsgContainer}
                >
                    {errMsg !== "" && <Text style={styles.errorMsg}>{errMsg}</Text>}
                </View>
                )}
                {/* <Text style={styles.title}>Boundary Vendor</Text> */}
                <Image
                    source={require("../assets/Screen_Shot_2022-10-14_at_11.56.26_AM-removebg-preview.png")}
                    style={{width: 200, height: 50, alignSelf: 'center', marginBottom: 10}}
                    resizeMode="contain"
                    ></Image>
              <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' />

                <View style={styles.form}>
                    <Input
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                    textContentType='emailAddress'
                    inputContainerStyle={styles.input}
                    inputStyle={styles.inputText}
                    leftIcon={{ type: 'material', name: 'email', color: themes.primary}}
                    clearButtonMode='while-editing'
                    autoCapitalize='none'
                    />

                    <Input
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    textContentType='password'
                    inputContainerStyle={styles.input}
                    inputStyle={styles.inputText}
                    secureTextEntry={true}
                    leftIcon={{ type: 'font-awesome', name: 'lock', color: themes.primary}}
                    clearButtonMode='while-editing'
                    autoCapitalize='none'
                    />

                </View>

                <View style={styles.buttonContainer}>
                    <Button 
                    icon={{ type: 'font-awesome', name: 'sign-in', color: !email||!password?'#BDBDBD':'white'}}
                    title='Sign In'
                    buttonStyle={styles.button}
                    loading={signinLoading}
                    disabled={!email||!password}
                    iconContainerStyle={styles.iconContainer}
                    onPress={() => {
                        signinVendor({ variables: { email, password }})
                    }}
                    />
                </View>
            </View>
            </TouchableWithoutFeedback>
         {/* </View> */}
      {/* <Text style={styles.text}></Text> */}
      {/* <ActivityIndicator /> */}
      <StatusBar barStyle="default" />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width - 70,
    marginBottom: 15,
    backgroundColor: themes.primary,
    // borderColor: "#6F5FC6",
  },
buttonContainer: {
    height: "45%",
    alignItems: "center",
    // marginTop: 20,
    zIndex: -10,
},
  container: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
    alignItems: 'center'
},
errorMsg: {
    color: "#C51162",
    fontFamily: "mr400",
  },
errorMsgContainer: {
    height: 30,
    borderColor: "#C51162",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "20%",
    marginVertical: 30
  },
  iconContainer: {
    marginHorizontal: 15
  },
  input: {
    height: 25,
    width: width / 1.5,
    fontSize: 16,
    color: "#6F5FC6",
    
  },
  inputText: {
    fontFamily: 'mr400'
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "mr400",
    fontSize: 18,
  },
  title: {
    fontFamily: "mr400",
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: themes.primary,
    marginVertical: 20
  },
});
