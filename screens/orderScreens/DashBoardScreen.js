import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import { Icon, Avatar, Overlay, Image, Card } from "react-native-elements";
// import {
//   defaultClient as apolloClient
// } from "../../clientLink";
// console.log('apolloclient', apolloClient)
import MapView, { Marker } from "react-native-maps";
import {
  useQuery,
  useMutation,
  useLazyQuery,
  useApolloClient
} from "@apollo/react-hooks";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from 'lodash'
import  moment  from "moment";
// import { useNavigation } from "@react-navigation/native";

import { SET_AUTH, SET_SHOPPING_CART_COUNT, SET_GUILD_ENROLLED } from "../../queries/queries_mutation";
import {
  GET_INIT_LOCATION,
  GET_CURRENT_RESIDENT,
  GET_PROMOTION_EVENTS,
  GET_AUTH,
  GET_PETS,
  GET_SHOPPING_CART
} from "../../queries/queries_query";
import themes from "../../assets/themes";
import { eventPics } from "../../assets/constData";
import defaultStates from "../../resolvers/defaultStates";

const { height, width } = Dimensions.get("window");
const cardGap = 20;
const cardWidth = (width - cardGap * 4) / 2;
const cardHeight = height / 3.8

export default function DashBoardScreen({ route, navigation }) {
  // const apolloClient = useApolloClient();

  //ref the right avatar menu
  const rightIcon = useRef(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState()
  const [promotionEvents, setPromotionEvents] = useState()
  const [region, setRegion] = useState();
  const [markerCoords, setMarkerCoords] = useState();
  const [runGetShoppingCartTimes, setRunGetShoppingCartTimes] = useState(0)
  

  


  //get auth from apollo local state
  const { data: authData } = useQuery(GET_AUTH);
  const {
    auth: { isAuthed },
  } = authData;

 
  console.log('isauthed', isAuthed)
  //set Auth mutation hook
  const [setAuth] = useMutation(SET_AUTH);
  const [setShoppingCartCount] = useMutation(SET_SHOPPING_CART_COUNT)
  const [setGuildEnrolled] = useMutation(SET_GUILD_ENROLLED)
  //query hook to get pets
  const { data: petsData } = useQuery(GET_PETS);
  // console.log("dashboard 49");
  // console.log(petsData.getPets);

  //query hook to get current resident
const { data: residentData, loading } = useQuery(GET_CURRENT_RESIDENT, {
    fetchPolicy: "cache-and-network",
  });

const { data: eventsData, loading: eventsLoading, error: eventsError } = useQuery(GET_PROMOTION_EVENTS)

const [getShoppingCart] = useLazyQuery(GET_SHOPPING_CART, {
  async onCompleted ({getShoppingCart}) {
    // console.log('shoppingcart', getShoppingCart)

    if (getShoppingCart.length>=0) {
      console.log('shoppingcart', getShoppingCart)
      console.log('dashboard')
      setShoppingCartCount( {variables: { count: getShoppingCart.length}})
    }
  },
  fetchPolicy: 'cache-and-network'
 })


  useEffect(() => {
    setIsOverlayVisible(eventsLoading)
    if(eventsData) {

      const newEventsList = eventsData.getPromotionEvents.map((event) => {
        const index = _.findIndex(eventPics, item => {
            return event.eventType == item.type
          })
          if (index >= 0) {
            return {...event, ...{eventTypeUri: eventPics[index].uri} }
          }
      })
      setPromotionEvents(newEventsList)
      console.log('promotionevent', promotionEvents)
    }
  }, [eventsData, eventsLoading, eventsError])

  // console.log(residentData);
  const signOut = async () => {
    setAuth({ variables: { isAuthed: false } });
    // apolloClient.onResetStore((cache) => cache.writeData({ data: defaultStates }))
    try {
      await AsyncStorage.removeItem("token");
      navigation.setOptions({
        headerTitle:  'Dashboard'})
      // navigation.replace("DashBoard");
      // await AsyncStorage.clear();
      // await client.clearStore();
    } catch (err) {
      console.log(err);
    }
    hideMenu();
  };
  

  const { data } = useQuery(GET_INIT_LOCATION);
  const {
    initLocation: { initLat, initLng },
  } = data;

  const initRegion = {
    latitude: initLat,
    longitude: initLng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.115,
  };
  useEffect(() => {
    setMarkerCoords({
      latitude: initLat,
      longitude: initLng,
    });
  }, []);

  // const navigation = useNavigation();

  const hideMenu = () => {
    rightIcon.current.hide();
  };

  const showMenu = () => {
    rightIcon.current.show();
  };

  useEffect(() => {
    if(residentData!=null&&isAuthed) {
      console.log('residentData', residentData)
      const {residentName, guild} = residentData.getCurrentResident
      if(guild) {
        setGuildEnrolled({ variables: { isEnrolled: true}})
      }
      if(runGetShoppingCartTimes==0) {
        getShoppingCart({ variables: { resident: residentName}})
        setRunGetShoppingCartTimes(1)
      }
    }
  }, [residentData])

  useEffect(() => {
    let mounted = true;
    if (
      isAuthed &&
      petsData &&
      residentData &&
      residentData.getCurrentResident &&
      mounted
    ) {
      navigation.setOptions({
        headerLeft: null,
        headerTitle:  'Hi ! ' + residentData.getCurrentResident.residentName ,
        headerRight: () => {
          return (
            <Menu
              ref={rightIcon}
              style={{ marginTop: 38 }}
              button={
                <Avatar
                  rounded
                  source={{
                    uri: residentData.getCurrentResident.avatarPic,
                  }}
                  size={30}
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
                  navigation.navigate("Profile", {
                    currentResident: residentData.getCurrentResident,
                    petsInfo: petsData.getPets,
                  });
                }}
              >
                Profile
              </MenuItem>

              {/* Initial Location */}
              <MenuItem
                onPress={() => {
                  // setLocationOverlay(true);
                  navigation.navigate("Initial Location", {
                    email: residentData.getCurrentResident.email,
                    postalCode: residentData.getCurrentResident.postalCode,
                    initialLat: residentData.getCurrentResident.initialLat,
                    initialLng: residentData.getCurrentResident.initialLng,
                  });
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
        headerTitle:  'Dashboard',
        headerRight: () => {
          return (
            <Menu
              ref={rightIcon}
              style={{ marginTop: 38 }}
              button={
                <Icon
                  name="person-outline"
                  type="ionicon"
                  color={themes.primary}
                  onPress={() => showMenu()}
                  style={{ marginRight: 28 }}
                />
              }
            >
              <MenuItem
                onPress={() => {
                  navigation.navigate("Login");
                  hideMenu();
                }}
              >
                Signin or Signup
              </MenuItem>

              <MenuItem onPress={() => hideMenu()} disabled>
                Menu item 3
              </MenuItem>
              <MenuDivider />
            </Menu>
          );
        },
      });
    }
    
    

    return () => {
      mounted = false;
    };
  }, [isAuthed, residentData, loading]);

  // guild deal status overlay window
  const renderPromotionEvents = ({ item, i }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('VendorInterface', { vendor: item.vendor })
      }}
    >
        <Card containerStyle={{
                              shadowColor: "#212121",
                              shadowRadius: 2,
                              shadowOffset: { width: 0, height: 2 },
                              marginTop: cardGap,
                              marginLeft: i % 2 !== 0 ? cardGap : 0,
                              width: cardWidth,
                              height: cardHeight,
                              backgroundColor: 'white',
                              borderRadius: 10,
                              shadowOpacity: 0.2,
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              padding: 2
                            }}>
                  
                    
                <Card.Title>{item.eventTitle}
                    
                </Card.Title>
                
                <Card.Image
                  source={{ uri: item.eventPhoto}}
                  resizeMode='contain'
                  style={{width: cardWidth - 2, height: cardHeight * 0.25,}}
                >
                
                  </Card.Image>
                  <Card.Divider />

                  <View style={styles.contentContainer}>
                      <Avatar 
                        source={{ uri: item.vendorLogo}}
                        avatarStyle={{borderRadius: 5, borderColor: '#fff', borderWidth: 1}}
                      />
                      <Text style={{fontSize: 13}}>&nbsp;&nbsp;{item.vendor}</Text>
                  </View>


                  <Card.Divider />

                <View style={styles.dateContainer}>
                      <Text style={{fontSize: 10}}>{moment(new Number(item.dateFrom)).format("YYYY-MM-DD")}&nbsp;To</Text>
                      <Text style={{fontSize: 10}}>&nbsp;{moment(new Number(item.dateTo)).format("YYYY-MM-DD")}</Text>
                </View>

                <Card.Divider />
                
                <View style={styles.actionsContainer}>
                  <Image 
                      source={item.eventTypeUri}
                      resizeMode='contain'
                      style={styles.eventTypeImg}
                    />      
                </View>
          
      </Card>
    </TouchableOpacity>
    
  );

  return (
    <View style={styles.container}>
      {/* Promotion Events */}
        <View style={styles.listContainer}>
        { promotionEvents&&
          <FlatList 
            data={promotionEvents}
            renderItem={renderPromotionEvents}
            keyExtractor={item => item._id} 
            showsVerticalScrollIndicator={false}
            numColumns={2}
          /> 
          }
        </View>
      {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            region={region}
            provider={"google"}
            initialRegion={initRegion}
            style={styles.mapView}
          >
            {markerCoords && (
              <Marker
                coordinate={markerCoords}
                image={require("../../assets/houseMarker.png")}
              ></Marker>
            )}
          </MapView>
        </View>
        {/* promotion events loading overlay */}
        <Overlay
         visible={isOverlayVisible}
         >
          <ActivityIndicator
            color="#0000ff"
            size='large'
          />
        </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({

actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
},

contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 2
},

container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
  },

dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
},

input: {
  color: themes.primary,
  marginVertical: 5,
  zIndex: -1,
},

eventTypeImg: {
  top: -11,
  left: 5,
  height: 60,
  width: 60,
},

listContainer: {
  height: "75%",
  // flex: 2,
  width: "97%",
  // backgroundColor: "pink",
},

mapContainer: {
  // flex: 1,
  height: "25%",
  width: "97%",
  // backgroundColor: "yellow",
  // margin: 5,
  // padding: 5,
  overflow: "hidden",
  borderRadius: 5,
  borderColor: "#FFFFFF",
  borderWidth: 0.5,
  // marginBottom: 8,
  // padding: 5,
},

mapView: {
  width: "100%",
  height: "100%",
  alignSelf: "center",
  // padding: 5,
},
});
