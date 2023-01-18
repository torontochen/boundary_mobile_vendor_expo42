import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Dimensions, 
    Keyboard  } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Tab, TabView, Overlay, Input, Button, Icon, Avatar, Image} from 'react-native-elements'
import { useQuery, useMutation, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

import { GET_AUTH, 
  GET_AUTH_ERROR , 
  GET_VENDOR_ORDERS, 
  GET_CURRENT_VENDOR, 
  GET_ITEM_CATALOG, 
  GET_RESIDENT_LIST, 
  GET_VENDOR_SALES_INFO,
  GET_VENDOR_SETTLEMENT_RECORDS
 } from '../../queries/queries_query'
import { SIGNIN_VENDOR, SET_AUTH_ERROR, SET_AUTH } from '../../queries/queries_mutation'
import { ORDER_STATUS_CHANGED, VENDOR_ORDER_ADDED, MESSAGE_RECEIVED } from '../../queries/queries_subscription';
import CustomerOrders  from '../../components/CustomerOrders'
import themes from "../../assets/themes";
import SalesOrder from '../../components/SalesOrder';

const { width, height } = Dimensions.get("window");


const OrderScreen = ({ navigation, route }) => {
    // const { vendor } = route.params
console.log('vendor in orderscreen', vendor)
    const rightIcon = useRef(null);
    // const [isAuthed, setIsAuthed] = useState()
    const [index, setIndex] = useState(0)
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [vendorOrders, setVendorOrders] = useState()
    const [vendorSettlement, setVendorSettlement] = useState()
    const [vendor, setVendor] = useState()

    const { data: authData } = useQuery(GET_AUTH)
    const {
      auth: { isAuthed },
    } = authData;
    console.log('isauthed in orderscreen', isAuthed)
    // useEffect(() => {
    //     const { auth: { isAuthed }} = authData
    //     setIsAuthed(isAuthed)
    // }, [authData])

    const { data: vendorData, loading: vendorLoading } = useQuery(GET_CURRENT_VENDOR)

    const [getVendorOrders, { data: orderData, loading }] = useLazyQuery(GET_VENDOR_ORDERS)
    const [getItemCatalog, {data: catalogData, loading: catalogLoading}] = useLazyQuery(GET_ITEM_CATALOG)
    const [ getVendorSalesInfo ] = useLazyQuery(GET_VENDOR_SALES_INFO)
    const [getResidentList, {loading: residentListLoading}] = useLazyQuery(GET_RESIDENT_LIST)
    const [getVendorSettlementRecords, { data: settlementData, loading: settlementLoading}] = useLazyQuery(GET_VENDOR_SETTLEMENT_RECORDS)

    useSubscription(ORDER_STATUS_CHANGED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { orderStatusChanged }} = subscriptionData
        //  console.log('vendorOrderStatusChanged',vendorOrderStatusChanged)
        const { vendor: orderVendor, resident, orderNo, content, isUnderDispute, isConfirmed, isCanceled } = orderStatusChanged

        if(vendor==orderVendor) {
          const index = vendorOrders.findIndex(order => order.orderNo == orderNo )
          if(index >= 0) {
            const orderList = [...vendorOrders]
            orderList[index].isCanceled = isCanceled
            orderList[index].isUnderDispute = isUnderDispute
            orderList[index].isConfirmed = isConfirmed
            orderList[index].disputeInfo = content
            
            setVendorOrders(orderList)
          }       
          // setChanged(!changed)
          
        }
         
      }
  })

  useSubscription(VENDOR_ORDER_ADDED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { vendorOrderAdded }} = subscriptionData
        // console.log('vendorOrderAdded', vendorOrderAdded)
        if(vendor==vendorOrderAdded.vendor) {
          // const newOrders = [...orders]
          // newOrders.push(vendorOrderAdded)
          const orderList = [...vendorOrders]
          orderList.push(vendorOrderAdded)
          setVendorOrders(orderList)
        }
      }
  })


    const hideMenu = () => {
      rightIcon.current.hide();
    };
  
    const showMenu = () => {
      rightIcon.current.show();
    };

    const signOut = async () => {
      setAuth({ variables: { isAuthed: false } });
      // setIsAuthed(!isAuthed)
      // apolloClient.onResetStore((cache) => cache.writeData({ data: defaultStates }))
      try {
        await AsyncStorage.removeItem("vendorToken");
        // navigation.replace("DashBoard");
        // await AsyncStorage.clear();
        // await client.clearStore();
      } catch (err) {
        console.log(err);
      }
      // hideMenu();
    };

    useEffect(() => {
      if(vendorData&&vendorData.getCurrentVendor!=null) {
        console.log('vendor', vendorData)
        const { getCurrentVendor } = vendorData
        setVendor(getCurrentVendor)
        getVendorOrders({ variables: { vendor: getCurrentVendor.businessTitle}})
        getItemCatalog({ variables: { subcategory: null, businessTitle: getCurrentVendor.businessTitle}})
        getResidentList()
        getVendorSalesInfo({ variables: { vendor: getCurrentVendor.businessTitle}})
        getVendorSettlementRecords({ variables: { vendor: getCurrentVendor.businessTitle}})
      }
    }, [vendorData])

    useEffect(() => {
      let mounted = true;
      if (
        isAuthed &&
        vendorData &&
        vendorData.getCurrentVendor &&
        mounted
      ) {
        navigation.setOptions({
          headerLeft: null,
          headerTitle:  'Hi ! ' + vendorData.getCurrentVendor.businessTitle ,
          headerRight: () => {
            return (
              <Menu
                ref={rightIcon}
                style={{ marginTop: 38 }}
                button={
                  <Image
                  resizeMode="contain"
                    source={{
                      uri: vendorData.getCurrentVendor.logo,
                    }}
                    style={{width:45, height: 45}}
                    onPress={() => showMenu()}
                    containerStyle={{ marginRight: 28, marginBottom: 7 }}
                  />
                }
              >
                {/* Profile */}
                <MenuItem
                  onPress={() => {
                    hideMenu();
                    // console.log(petsData.getPets);
                   
                  }}
                >
                  Profile
                </MenuItem>
  
                {/* Initial Location */}
                <MenuItem
                  onPress={() => {
                    // setLocationOverlay(true);
                   
                    hideMenu();
                  }}
                >
                  Initial Location
                </MenuItem>
  
                <MenuDivider />
                {/* Sign out */}
                {isAuthed && (
                  <MenuItem
                    onPress={() => {
                      signOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                )}
              </Menu>
            );
          },
        });
      } else {
        navigation.setOptions({
          headerLeft: null,
          headerTitle:  'Boundary Vendor',
          headerRight: null
          //   return (
          //     <Menu
          //       ref={rightIcon}
          //       style={{ marginTop: 38 }}
          //       button={
          //         <Icon
          //           name="person-outline"
          //           type="ionicon"
          //           color={themes.primary}
          //           onPress={() => showMenu()}
          //           style={{ marginRight: 28 }}
          //         />
          //       }
          //     >
          //       <MenuItem
          //         onPress={() => {
          //           navigation.navigate("Login");
          //           hideMenu();
          //         }}
          //       >
          //         Signin or Signup
          //       </MenuItem>
  
          //       <MenuItem onPress={() => hideMenu()} disabled>
          //         Menu item 3
          //       </MenuItem>
          //       <MenuDivider />
          //     </Menu>
          //   );
          // },
        });
      }
      
      
  
      return () => {
        mounted = false;
      };
    }, [isAuthed, vendorData, loading]);

    useEffect(() => {
      if(orderData) {
        console.log('orders', orderData)
        const { getVendorOrders } = orderData
        setVendorOrders(getVendorOrders)
      }
        
    }, [orderData, loading])

    useEffect(() => {
      if(settlementData) {
        // console.log('orders', orderData)
        const { getVendorSettlementRecords } = settlementData
        setVendorSettlement(getVendorSettlementRecords)
      }
        
    }, [settlementData, settlementLoading])

    const [setAuth] = useMutation(SET_AUTH,{
      refetchQueries:[{query: GET_CURRENT_VENDOR}],
      awaitRefetchQueries: true
    })

    //AuthError
    const [setAuthError] = useMutation(SET_AUTH_ERROR);
    const { data } = useQuery(GET_AUTH_ERROR);
    // if (data) {
    const {
        authError: { errMsg },
    } = data;

     // Signing In
  const [signinVendor, {loading: signinLoading}] = useMutation(SIGNIN_VENDOR, {
    async onCompleted({ signinVendor }) {
      console.log("signIn");
      const { token } = signinVendor;
      try {
        await AsyncStorage.setItem("vendorToken", token);
        setAuth({ variables: { isAuthed: true } });
        // setIsAuthed(!isAuthed)
        navigation.replace('Order')
      } catch (err) {
        console.log(err.message);
      }
    },
    async onError(error) {
      console.log({ error });
      const loc = error.message.indexOf(":");
      const msg = error.message.slice(loc + 1);
      setAuthError({ variables: { errMsg: msg } });
    },
  });

    return ( 
     <>
         { !isAuthed ? 
            
         <View>
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

                <View style={styles.form}>
                    <Input
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                    textContentType='emailAddress'
                    inputContainerStyle={styles.input}
                    leftIcon={{ type: 'material', name: 'email', color: themes.primary}}
                    clearButtonMode='while-editing'
                    autoCapitalize='none'
                    />

                    <Input
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    textContentType='password'
                    inputContainerStyle={styles.input}
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
         </View> :
         
         <>
              <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                backgroundColor: 'white',
                height: 3,
                }}
                variant="primary"
                disableIndicator={true}
            >
                <Tab.Item
                title="Customer Orders"
                titleStyle={{ fontSize: 8 }}
                style={{ marginTop: 6 }}
                icon={{ name: 'file-contract', type: 'font-awesome-5', color: 'white' }}
                />
                {/* <Tab.Item
                title="Events"
                titleStyle={{ fontSize: 8 }}
                icon={{ name:'calendar-alt', type: 'font-awesome-5', color: 'white' }}
                style={{ marginTop: 6 }}
                />
                <Tab.Item
                title="Customer"
                titleStyle={{ fontSize: 8 }}
                style={{ marginTop: 6 }}
                icon={{ name: 'people-arrows', type: 'font-awesome-5', color: 'white' }}
                /> */}
                <Tab.Item
                title="Sales Order"
                style={{ marginTop: 6 }}
                titleStyle={{ fontSize: 8 }}
                icon={{ name: 'file-alt', type: 'font-awesome-5', color: 'white' }}
                />
            </Tab>

              <TabView value={index} onChange={setIndex} animationType='timing'>
               
                <TabView.Item 
                  style={{ backgroundColor: 'white', width: '100%' }  } 
                  onMoveShouldSetResponder={(e) => e.stopPropagation()}
                >
                 {
                 vendorData&&orderData&&vendorSettlement&&
                 <CustomerOrders 
                 vendorOrders={orderData.getVendorOrders} 
                 navigation={navigation} 
                 vendor={vendorData.getCurrentVendor.businessTitle} 
                 settlementRecords= {settlementData.getVendorSettlementRecords}/>}
                </TabView.Item>

                {/* <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                <Text h1>Favorite</Text>
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                <Text h1>yes</Text>
                </TabView.Item> */}

                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }} 
                onMoveShouldSetResponder={(e) => e.stopPropagation()}>
                {vendor&&catalogData&&
                <SalesOrder 
                  catalog={catalogData.getItemCatalog} 
                  vendor={vendorData.getCurrentVendor} 
                  navigation={navigation}
                  
                />}
                </TabView.Item>

            </TabView>     
                
             {/* vendor interface loading overlay */}
                <Overlay
                visible={loading || vendorLoading || residentListLoading || catalogLoading || settlementLoading }
                fullScreen
                >
                  <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            
                  <Image
                    source={require("../../assets/Screen_Shot_2022-10-14_at_11.56.26_AM-removebg-preview.png")}
                    style={{width: 200, height: 50, alignSelf: 'center', marginBottom: 50}}
                    resizeMode="contain"
                    ></Image>
                  <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' />

                  </View>

                {/* <ActivityIndicator
                    color={themes.primary}
                    size='large'
                /> */}
                </Overlay>
         </> }

        </>
    )
}

const styles = StyleSheet.create({

    button: {
        width: width - 70,
        marginBottom: 15,
        // backgroundColor: "#6F5FC6",
        borderColor: "#6F5FC6",
        color: "#6F5FC6",
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
        justifyContent: 'space-evenly',
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
        justifyContent: "space-around",
        alignItems: "center",
        height: "25%",
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
})



export default OrderScreen