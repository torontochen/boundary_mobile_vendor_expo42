import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import { BottomSheet, ListItem, Icon } from "react-native-elements";
import { useQuery, useSubscription, useLazyQuery } from "@apollo/react-hooks"
// import { SET_ACTIVE_FLYER_LOCAL } from "../../queries/queries_mutation"


import { GET_ACTIVE_FLYER, GET_CURRENT_RESIDENT, GET_ALL_GUILDS, GET_ALL_GUILD_DEALS, GET_RESIDENT_ORDERS} from "../../queries/queries_query"
import { UPDATE_ACTIVE_FLYER } from "../../queries/queries_subscription"
import _ from "lodash"

import themes from "../../assets/themes";
import { guildLogos } from "../../assets/constData";

const { width, height } = Dimensions.get("window");
const HomeScreen = ({ navigation }) => {

  const [isVisibleMailBag, setIsVisibleMailBag] = useState(false);
  const [isVisibleSafe, setIsVisibleSafe] = useState(false);
  const [isVisiblePet, setIsVisiblePet] = useState(false);
  const [isVisibleGuild, setIsVisibleGuild] = useState(false);
  
  const [getResidentOrdersTimes, setGetResidentOrdersTimes] = useState(0)
  const [newFlyerList, setNewFlyerList] = useState([])
  const [stashedFlyers, setStashedFlyers] = useState([])
  const [activeFlyerList, setActiveFlyerList] = useState([])
  const [petImgUrl, setPetImgUrl] = useState()
  const [guildIcon, setGuildIcon] = useState()
  const [guildList, setGuildList] = useState([])
  const [residentOrders, setResidentOrders] = useState()
  

  const {data, loading, error} = 
  useQuery(GET_ACTIVE_FLYER 
    //   {
    //     onComplete:(data) => {
    //       console.log(data)
    //       if(data ) {
    //     //  console.log(data.getActiveFlyer)
    //     const flyerList = []
    //     data.getActiveFlyer.map(flyers => {
    //       flyers.vendorActiveFlyer.map(flyer => {
    //         flyerList.push({
    //           businessTitle: flyers.businessTitle,
    //           logo: flyers.logo,
    //           businessCategory: flyers.businessCategory,
    //           flyerId: flyer.flyerId, 
    //           flyerTitle: flyer.flyerTitle, 
    //           flyerType: flyer.flyerType, 
    //           dateFrom: flyer.dateFrom, 
    //           dateTo: flyer.dateTo,
    //           promoInfo: flyer.promoInfo
    //         })
    //       })
    //     })
    //     setActiveFlyerList(flyerList)
    //     // console.log(newFlyerList)
    //         }

    //     },
    //     onError({error}){
    //       console.log(error.Text)
    //     },
    //     // fetchPolicy: "network-only",
    //     // notifyOnNetworkStatusChange: true
    // }
  )

 const {data: residentData, loading: residentLoading, error: residentError} = useQuery(GET_CURRENT_RESIDENT)
 const {data: guildsData, loading: guildsLoading, error: guildsError} = useQuery(GET_ALL_GUILDS)
 const {data: guildDealsData, loading: guildDealsLoading, error: guildDealsError} = useQuery(GET_ALL_GUILD_DEALS)
 const [getResidentOrders] = useLazyQuery(GET_RESIDENT_ORDERS, {
   async onCompleted({ getResidentOrders }) {
     console.log('resident orders', getResidentOrders)
      setResidentOrders(getResidentOrders)
   }
 })
//  const {data: guildDealsStatusData, loading: guildDealsStatusLoading, error: guildDealsStatusError} = 
//  useQuery(GET_GUILD_DEALS_STATUS, 
//         { variables: { guildFullName: 
//                       residentData && residentData.getCurrentResident.guild 
//                       ? residentData.getCurrentResident.guild.guildFullName 
//                       : null },
//           async onCompleted({getGuildDealsStatus}) {
//                             if(getGuildDealsStatus) {
//                               setGuildDealsStatus(getGuildDealsStatus)
//                             }
//                           }         
//         })

 
  // const [setActiveFlyerLocal] = useMutation(SET_ACTIVE_FLYER_LOCAL)
 useSubscription(UPDATE_ACTIVE_FLYER, {
   onSubscriptionData({subscriptionData}) {
      console.log("homescreen83")
      const { data: { updateActiveFlyers }} = subscriptionData
      console.log(updateActiveFlyers)
      const flyerList = []
      updateActiveFlyers.map(flyers => {
        flyers.vendorActiveFlyer.map(flyer => {
          flyerList.push({
            businessTitle: flyers.businessTitle,
            logo: flyers.logo,
            businessCategory: flyers.businessCategory,
            flyerId: flyer.flyerId, 
            flyerTitle: flyer.flyerTitle, 
            flyerType: flyer.flyerType, 
            dateFrom: flyer.dateFrom, 
            dateTo: flyer.dateTo,
            promoInfo: flyer.promoInfo
          })
        })
      })
      
    setActiveFlyerList(flyerList)

      // console.log(newFlyerList)
   }
 })

useEffect(() => {
  if(guildsData) {
    console.log('all guilds', guildsData.getAllGuilds)
    // setGuildList(guildsData.getAllGuilds)
  }
}, [guildsData, guildsLoading, guildsError])

useEffect(() => {
  if(data ) {
        console.log('active flyers',data.getActiveFlyer)
        const flyerList = []
        data.getActiveFlyer.map(flyers => {
          flyers.vendorActiveFlyer.map(flyer => {
            flyerList.push({
              businessTitle: flyers.businessTitle,
              logo: flyers.logo,
              businessCategory: flyers.businessCategory,
              flyerId: flyer.flyerId, 
              flyerTitle: flyer.flyerTitle, 
              flyerType: flyer.flyerType, 
              dateFrom: flyer.dateFrom, 
              dateTo: flyer.dateTo,
              promoInfo: flyer.promoInfo
            })
          })
        })
        setActiveFlyerList(flyerList)
        // console.log(newFlyerList)
            }
}, [data, loading, error])

// useEffect(() => {
    // console.log(data.getActiveFlyer)
  //  if(residentData.getCurrentResident!=null && activeFlyerList.length > 0) {
  //    console.log("homescreen94")
  //    console.log(activeFlyerList)
  //    const { getCurrentResident: { stashedFlyers, flyersFedToPet, pet } } = residentData
  //   //  const flyerList = []
  //   //  activeFlyerList.map((item) => {
  //     setPetImgUrl(pet.petImgUrl)
  //     // setStashedFlyers(stashedFlyers)
  //     console.log(petImgUrl)
  //     activeFlyerList.map((flyer, i, array) => {
  //       const index = _.findIndex(
  //         stashedFlyers,
  //         (stashedFlyer) => {
  //           return flyer.flyerId == stashedFlyer.flyerId;
  //         }
  //       );

  //       if (
  //         index >= 0 ||
  //         flyersFedToPet.includes(flyer.flyerId)
  //       ) {
  //         array.splice(i);
  //       }
  //     });
    // });
    // data.getActiveFlyer.map(flyers => {
    //   flyers.vendorActiveFlyer.map(flyer => {
    //     flyerList.push({
    //       businessTitle: flyers.businessTitle,
    //       logo: flyers.logo,
    //       businessCategory: flyers.businessCategory,
    //       flyerId: flyer.flyerId, 
    //       flyerTitle: flyer.flyerTitle, 
    //       flyerType: flyer.flyerType, 
    //       dateFrom: flyer.dateFrom, 
    //       dateTo: flyer.dateTo,
    //       promoInfo: flyer.promoInfo
    //     })
    //   })
    // })

  //   setNewFlyerList(activeFlyerList)
  //  }
  // }, [residentData, activeFlyerList, loading, residentLoading])
  const setGuildLogo = (guild) => {
    if(guild != null) {
      const index = _.findIndex(guildLogos, item => {
        // console.log(guild.guildLogo)
        // console.log(item.icon)
        return guild.guildLogo == item.icon
      })
      // console.log('index',index)
      if(index >= 0) {
         const  guildImg = guildLogos[index].uri
      setGuildIcon(guildImg)
      }
   
    } else {
      const guildImg1 = require("../../assets/st_small_507x507-pad_600x600_f8f8f8-removebg-preview.png")
      // console.log('guildImg1',guildImg1)
      setGuildIcon(guildImg1)
    }
    // console.log('homescreen 198')
    // console.log('guildIcon',guildIcon)
  }

  
  useEffect(() => {
    DeviceEventEmitter.addListener('joinGuildEvent', value => {
    // console.log(value.guild)
    setGuildLogo(value.guild)

    
  })
  return () => {
        DeviceEventEmitter.removeListener('joinGuildEvent')
      }

  }, [])

useEffect(() => {
 if(residentData.getCurrentResident != null){
   console.log("homescreen116")
   console.log('residentData',residentData)
  //   console.log(residentData.getCurrentResident.stashedFlyers)
    const { getCurrentResident: { stashedFlyers, pet, guild, residentName } } = residentData
    // console.log(guild.guildLogo)
    setStashedFlyers(stashedFlyers)
    setPetImgUrl(pet.petImgUrl)
    setGuildLogo(guild)
    if(getResidentOrdersTimes == 0) {
      getResidentOrders({ variables: { resident: residentName }})
      setGetResidentOrdersTimes(1)
    }
    
 }
}, [residentData, residentLoading, residentError])



  const listMailBag = [
    {
      title: "Flyers",
      titleStyle: { color: themes.primary },
      icon: {
        name: "ad",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        activeFlyerList.map((flyer, i, array) => {
          const index = _.findIndex(
           residentData.getCurrentResident.stashedFlyers,
            (stashedFlyer) => {
              return flyer.flyerId == stashedFlyer.flyerId;
            }
          );
            
          if (
            index >= 0 ||
            residentData.getCurrentResident.flyersFedToPet.includes(flyer.flyerId)
          ) {
            console.log(i)
            array.splice(i);
            console.log(array)
          }
        });
        setNewFlyerList(activeFlyerList)

        navigation.navigate("MailBag", {newFlyerList: activeFlyerList});
        setIsVisibleMailBag(false);
      },
    },

    {
      title: 'Orders',
      titleStyle: { color: themes.primary  },
      icon: {
        name: "newspaper",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        navigation.navigate('Order', { order: residentOrders })
        setIsVisibleMailBag(false);
      }
    },
   
    {
      title: "Exit",
      titleStyle: { color: 'white' },
      icon: {
        name: "exit",
        type: "ionicon",
        color: "white",
      },
      containerStyle: { backgroundColor: themes.primary },
      onPress: () => {
        setIsVisibleMailBag(false);
      },
    },
  ];

  const listGuild = [
    { 
      title: "Allies",
      titleStyle: { color: themes.primary },
      icon: {
        name: "handshake",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        setIsVisibleGuild(false);
        
      },
     },
    { 
      title: "Start a guild",
      titleStyle: { color: themes.primary },
      icon: {
        name: "users-cog",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        navigation.navigate('StartGuild')
        setIsVisibleGuild(false);
      }
     },
    { 
      title: "Join a guild",
      titleStyle: { color: themes.primary },
      icon: {
        name: "users",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        // console.log('guildList home sreen', guildsData.getAllGuilds)
        navigation.navigate('JoinGuild', { guildList: guildsData.getAllGuilds })
        setIsVisibleGuild(false);
      }
     },
    { 
      title: "My Guild",
      titleStyle: { color: themes.primary },
      icon: {
        name: "user-friends",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        console.log('my guild', residentData.getCurrentResident.guild)
        navigation.navigate('MyGuild', { guild: residentData.getCurrentResident.guild })
        setIsVisibleGuild(false);
      }
     },
    { 
      title: "Guild Deals",
      titleStyle: { color: themes.primary },
      icon: {
        name: "file-contract",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        navigation.navigate('GuildDeals', { guildDeals: guildDealsData.getAllGuildDeals, 
                                            myGuild: residentData.getCurrentResident.guild.guildFullName
                                          })
        setIsVisibleGuild(false);
      }
     },
    { 
      title: "Locate Guild Members",
      titleStyle: { color: themes.primary },
      icon: {
        name: "map-marker-alt",
        type: "font-awesome-5",
        color: themes.primary,
      },
      onPress: () => {
        setIsVisibleGuild(false);
      }
     },
     {
      title: "Exit",
      titleStyle: { color: "white" },
      icon: {
        name: "exit",
        type: "ionicon",
        color: "white",
      },
      containerStyle: { backgroundColor: themes.primary },
      onPress: () => {
        setIsVisibleGuild(false);
      },
    }
  ]

  const listSafe = [
    {
      title: "Stash",
      titleStyle: { color: themes.primary },
      icon: {
        name: "archive",
        type: "FontAwesome",
        color: themes.primary,
      },
      onPress: () => {
        navigation.navigate("Stash", {stashedFlyers});
        setIsVisibleSafe(false);
      },
    },
    {
      title: "Silver Coin",
      titleStyle: { color: "#BDBDBD" },
      icon: {
        name: "coins",
        type: "font-awesome-5",
        color: "#BDBDBD",
      },
      onPress: () => {
        navigation.navigate("SilverCoin");
        setIsVisibleSafe(false);
      },
    },
    {
      title: "Gold Coin",
      titleStyle: { color: "#FFD600" },
      icon: {
        name: "coins",
        type: "font-awesome-5",
        color: "#FFD600",
      },
      onPress: () => {
        navigation.navigate("GoldCoin");
        setIsVisibleSafe(false);
      },
    },
    {
      title: "Exit",
      icon: {
        name: "exit",
        type: "ionicon",
        color: "white",
      },
      titleStyle: { color: "white" },
      containerStyle: { backgroundColor: themes.primary },
      onPress: () => {
        setIsVisibleSafe(false);
      },
    },
  ];

  return (residentData&&
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* <Text style={styles.title}> My Home</Text> */}
        <ImageBackground
          source={require("../../assets/house3.jpg")}
          style={styles.image}
        >

          {/* Guild */}
          <TouchableOpacity
            onPress={() => {
              setIsVisibleGuild(true);
            }}
          >
            <Image
              source={guildIcon}
              style={styles.guild}
            ></Image>
          </TouchableOpacity>


          {/* Mail Bag */}
          <TouchableOpacity
            onPress={() => {
              setIsVisibleMailBag(true);
            }}
          >
            <Image
              source={require("../../assets/mailbag-removebg-preview.png")}
              style={styles.mailBag}
            ></Image>
          </TouchableOpacity>
          
          {/* Pet */}
         {petImgUrl && <TouchableOpacity
            onPress={() => {
              setIsVisiblePet(true);
            }}
            resizeMode="contain"
          >
            <Image
              source={{uri: 
                // "https://www.animatedimages.org/data/media/532/animated-chicken-image-0157.gif"
                petImgUrl
              }}
              style={styles.pet}
            ></Image>
          </TouchableOpacity>} 

          {/* Safe */}
          <TouchableOpacity
            onPress={() => {
              setIsVisibleSafe(true);
            }}
          >
            <Image
              source={require("../../assets/safe1-removebg-preview.png")}
              style={styles.safe}
            ></Image>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* Mail Bag */}
      <BottomSheet
        isVisible={isVisibleMailBag}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {listMailBag.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <Icon name={l.icon.name} type={l.icon.type} color={l.icon.color} />
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </BottomSheet>

      {/* Safe */}
      <BottomSheet
        isVisible={isVisibleSafe}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {listSafe.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <Icon name={l.icon.name} type={l.icon.type} color={l.icon.color} />
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </BottomSheet>

      {/* Guild */}
      <BottomSheet
        isVisible={isVisibleGuild}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)"}}
      >
        {residentData.getCurrentResident&&listGuild.map((l, i) => {

          let showUp = false
            const { getCurrentResident: { guild, guildOwned }} = residentData
            // console.log('guildDeal', guildDealsData)
            // console.log('guilddealstatus', guildDealsStatus)
          switch (l.title) {
            case "Allies":
              if(guild!=null){
                showUp = true
              }
              break;
            case "Start a guild":
              if(guild==null) {
                showUp = true
              }
              break;
            case "Join a guild":
              if(guild==null) {
                showUp = true
              }
              break;
            case "My Guild":
              if(guild!=null) {
                showUp = true
              }
              break;
            case "Guild Deals":
              if(guild!=null&&guildDealsData!=null) {
                showUp = true
              }
              break;
            case "Locate Guild Members":
              if(guildOwned!=null) {
                showUp = true
              }
              break;
            case "Exit":
                showUp = true
              break;
          }
         return (showUp&&<ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <Icon name={l.icon.name} type={l.icon.type} color={l.icon.color} />
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>) 
        })}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    marginVertical: 15,
  },
  imageContainer: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: 30,
    paddingTop: 20,
    
    // backgroundColor: "pink",
  },
  image: {
    // flex: 1,
    height: height / 3,
    width: width - 20,
    // height: "50%",
    // width: "80%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#FAFAFA',
    overflow: "hidden",
    resizeMode: "cover",
    justifyContent: "center",
  },
  mailBag: {
    height: 60,
    width: 60,
    left: 240,
    top: 60,
    position: "absolute",
    shadowColor: "#212121",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: -8, height: 2 },
  },

  safe: {
    height: 60,
    width: 60,
    left: 60,
    top: 45,
    position: "absolute",
    shadowColor: "#212121",
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowOffset: { width: -8, height: 2 },
  },

  pet: {
    height: 60,
    width: 60,
    left: 130,
    top: 70,
    position: "absolute",
    shadowColor: "#212121",
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowOffset: { width: -8, height: 2 },
  },

  guild: {
    height: 60,
    width: 60,
    left: 30,
    top: -100,
    position: "absolute",
    shadowColor: "#212121",
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowOffset: { width: -8, height: 2 },
  },
});

export default HomeScreen;