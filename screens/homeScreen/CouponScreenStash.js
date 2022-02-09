import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions, ActivityIndicator} from "react-native";
import {Card, Image, Avatar, Icon, Divider, Badge,Overlay} from "react-native-elements"
import { useQuery, useMutation, useLazyQuery} from "@apollo/react-hooks"
import moment from "moment";
import _ from "lodash"

import themes from "../../assets/themes";
import { GET_CURRENT_RESIDENT, GET_SELECTED_FLYER_CLIENT_VIEW } from "../../queries/queries_query"
import { UPDATE_PET_EXP_SILVER_STASH, UPDATE_STAHSED_FLYERS } from "../../queries/queries_mutation"
import FeedPet  from "../../components/FeedPet";
import PagesPreview from "../../components/PagesPreview"



const { height, width } = Dimensions.get("window");

const CouponScreenStash = ({navigation, route}) => {
  
  const { originalCouponPagesStashed, title } = route.params
  console.log("CouponScreenStash16")
  // console.log(originalCouponPagesStashed)
  const [pet, setPet] = useState()
  const [petLevel, setPetLevel] = useState("")
  const [petExperience, setPetExperience] = useState()
  const [silverCoins, setSilverCoins] = useState(0)
  const [residentName, setResidentName] = useState("")
  const [isFeedingPet, setIsFeedIngPet] = useState(false)
  const [trigerAnimation, setTrigerAnimation] = useState(false)
  const [flyersToReview, setFlyerToReview] = useState([])
  const [isFlyerReviewOpen, setIsFlyerReviewOpen] = useState(false)
//   const [updatedCouponPagesStashed, setUpdatedCouponPagesStashed] = useState()
//  setUpdatedCouponPagesStashed(originalCouponPagesStashed)

  const animationOpacity = useRef(new Animated.Value(1)).current
  const petExpPosition = useRef(new Animated.ValueXY({x:10, y: 30})).current
  const silverPosition = useRef(new Animated.ValueXY({x:50, y: 100})).current



  const { data: currentResident, loading, error } = useQuery(GET_CURRENT_RESIDENT)

  const [getSelectedFlyerClientView, {loading: seletFlyerLoading}] = useLazyQuery(GET_SELECTED_FLYER_CLIENT_VIEW, {
    async onCompleted({ getSelectedFlyerClientView }) {
      // console.log(getSelectedFlyerClientView);
      setFlyerToReview(getSelectedFlyerClientView)
      setIsFlyerReviewOpen(true)
      // const { emailVal } = getSelectedFlyerClientView;
      // if (emailVal) {
      //   setAuthError({
      //     variables: { errMsg: "This email is registered" },
      //   });
      // }
    },
    fetchPolicy: "cache-and-network",
  });
  

  useEffect(() => {
    // console.log(currentResident)
    if(currentResident){
      const {pet, petLevel, petExperience, silverCoins, residentName } = currentResident.getCurrentResident
      setPetLevel(petLevel)
      setPetExperience(petExperience)
      setPet(pet)
      setSilverCoins(silverCoins)
      setResidentName(residentName)
      navigation.setOptions({
        headerRight: () => {
          return (
            <View style={{
                flexDirection: "row",
                justifyContent: "center", 
                alignItems: "center", 
                marginTop: 10, 
                width: 100}}>
                <Icon 
                  name="coins"
                  type="font-awesome-5"
                  color="#757575"
                  style={{marginRight: 5}}
                  />
                <Text style={{fontSize:14, color: "#757575"}}>{silverCoins.toString()}</Text>
            </View>
          )
        },
        headerTitle: title,
        headerTitleAlign: "left",
      })
   }
  }, [currentResident, loading, error])


   const [updatePetExpSilverStash] = useMutation(UPDATE_PET_EXP_SILVER_STASH, {
    async update(cache, { data: { updatePetExpSilverStash } }) {
      // console.log(updatePetExpSilverStash);
      // First read the query you want to update
      const data = cache.readQuery({ query: GET_CURRENT_RESIDENT });
      // Create updated data
      data.getCurrentResident.petExperience= updatePetExpSilverStash.petExperience;
      data.getCurrentResident.silverCoins = updatePetExpSilverStash.silverCoins;
      data.getCurrentResident.flyersFedToPet.push(updatePetExpSilverStash.flyerId)
      data.getCurrentResident.stashedFlyers.splice(0, data.getCurrentResident.stashedFlyers.length)
      updatePetExpSilverStash.stashedFlyers.map((flyer, i) => {
        data.getCurrentResident.stashedFlyers.push({
          vendor: flyer.vendor,
          flyerId: flyer.flyerId,
          flyerTitle: flyer.flyerTitle,
          flyerType: flyer.flyerType,
          dateFrom: flyer.dateFrom,
          dateTo: flyer.dateTo,
          promoInfo: flyer.promoInfo,
          logo: flyer.logo,
          __typename: "StashedFlyer",
        })
      })
      // Write updated data back to query
      // console.log(data);
      cache.writeQuery({
        query: GET_CURRENT_RESIDENT,
        data,
      });
    },
    refetchQueries: [{query: GET_CURRENT_RESIDENT}],
    awaitRefetchQueries: true
    // optimisticResponse: {
    //   __typename: "Mutation",
    //   updatePetExpSilver: {
    //     __typename: "PetExpSilModified",
    //    petExperience,
    //    silverCoins
    //   },
    // },
  });

   const [updateStashedFlyers] = useMutation(UPDATE_STAHSED_FLYERS, {
    async update(cache, { data: { updateStashedFlyers } }) {
      // console.log(changePostalCode);
      // First read the query you want to update
      const data = cache.readQuery({ query: GET_CURRENT_RESIDENT });
      // Create updated data
      data.getCurrentResident.stashedFlyers.splice(0, data.getCurrentResident.stashedFlyers.length)
      updateStashedFlyers.map((flyer, i) => {
        data.getCurrentResident.stashedFlyers.push({
          vendor: flyer.vendor,
          flyerId: flyer.flyerId,
          flyerTitle: flyer.flyerTitle,
          flyerType: flyer.flyerType,
          dateFrom: flyer.dateFrom,
          dateTo: flyer.dateTo,
          promoInfo: flyer.promoInfo,
          logo: flyer.logo,
          __typename: "StashedFlyer",
        })
      })
      // setUpdatedCouponPagesStashed(updateStashedFlyers)
      // Write updated data back to query
      // console.log(data);
      cache.writeQuery({
        query: GET_CURRENT_RESIDENT,
        data,
      });
    },
    refetchQueries: [{query: GET_CURRENT_RESIDENT}],
    awaitRefetchQueries: true
    // optimisticResponse: {
    //   __typename: "Mutation",
    //   changePostalCode: {
    //     __typename: "StashedFlyer",
    //    petExperience,
    //    silverCoins
    //   },
    // },
  });

  useEffect(() => {
     navigation.setOptions({
        headerRight: () => {
          return (
            <View style={{
              flexDirection: "row",
              justifyContent: "center", 
              alignItems: "center", 
              marginVertical: 10, 
              marginHorizontal: 10,
              width: 100}}>
              <Icon 
                name="coins"
                type="font-awesome-5"
                color="#757575"
                style={{marginRight: 10}}
                size={18}
                />
                <Text
                style={{fontSize:14, color: "#757575", fontWeight: "bold"}}>{silverCoins.toString()}</Text>
            </View>
          )
        }
      })
  }, [silverCoins])

  const convertDate = (timeText) => {
    const timeStamp = parseInt(timeText, 10)
    return moment(timeStamp).format("YYYY-MM-DD")
  }

 

  const animateSimpleCoupon = (vendor, flyerId) => {
  //  console.log(petExpPosition.x)
   Animated.parallel
    ([
      Animated.timing(animationOpacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true
      }),

       Animated.timing(silverPosition, {
        toValue: {x: width-270, y: -10},
        duration: 3000,
        useNativeDriver: true
      }),

      Animated.timing(petExpPosition, {
        toValue: {x: 15, y: 0},
        duration: 3000,
        useNativeDriver: true
      })
    ]).start(({finished})=> {
      if(finished){
        petExpPosition.setValue({x:10, y: 30})
        silverPosition.setValue({x:50, y: 100})
        animationOpacity.setValue(1)
        setTrigerAnimation(false)
        setPetExperience(petExperience + 100)
        setSilverCoins(silverCoins + 100)
        // console.log(petExperience, silverCoins)
        updatePetExpSilverStash({ variables: {
          residentName, petExperience: petExperience + 100, silverCoins: silverCoins + 100, vendor, flyerId
        }})
        // console.log(vendor, flyerId)
        // _.pullAllWith(simpleCoupon, [{ vendor, flyerId }], _.isEqual)
        // console.log("line 183")
        updateStashedFlyers({ variables: { residentName, flyerId }})
        const index = _.findIndex(originalCouponPagesStashed, coupon => {
          return coupon.flyerId == flyerId
        })
        originalCouponPagesStashed.splice(index, 1)
        // console.log(originalCouponPagesStashed)

      }
    })
  }

  const toggleOverlay = () => {
    setIsFlyerReviewOpen(!isFlyerReviewOpen)
  };


  return (
    <View style={styles.container}>
     {pet && isFeedingPet && (
       <FeedPet 
        pet = {pet}
        petExperience = {petExperience}
        petLevel ={petLevel}
        petExpPosition = {petExpPosition}
        animationOpacity = {animationOpacity}
        silverPosition = {silverPosition}
        trigerAnimation = { trigerAnimation }
        setIsFeedIngPet = { setIsFeedIngPet }
        />
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {originalCouponPagesStashed && originalCouponPagesStashed.map((coupon, i) => {
          return (
          <View key={i}>
               <Card containerStyle={styles.cardStyle}>
              <Card.Title style={{color: themes.primary}}>{coupon.flyerTitle}</Card.Title>

              <Card.Divider/>
              <View style={styles.subContainer}>
                <View style={styles.subLogoContainer}>
                  <Avatar
                  size = "medium"
                    source={{
                      uri: coupon.logo
                    }}
                  />
                  <Card.Title style={{marginTop: 20, color: themes.primary}}>{coupon.vendor}</Card.Title>
                </View>
                <View style={styles.subInfoContainer}>
                  <Card.Title style={{color: themes.primary}}>{coupon.promoInfo}</Card.Title>
                  <Text style={{color: themes.primary, fontSize: 12}}>Expire on:  {convertDate(coupon.dateTo)}</Text>
                 
                </View>
              </View>
              <Card.Divider/>
                  <View style={styles.iconsContainer}>
                    <Icon 
                    raised 
                    size={24} 
                    name="search-plus" 
                    type="font-awesome-5" 
                    color={themes.primary} 
                    onPress={()=> {
                        getSelectedFlyerClientView({variables: {flyerId : coupon.flyerId, businessTitle: coupon.vendor}})
                     
                    }} />

                    <TouchableOpacity
                     onPress={(evt)=> {
                       if(isFeedingPet) {
                        setTrigerAnimation(true)
                        // console.log(evt.nativeEvent)
                        // console.log("feed pet")
                        animateSimpleCoupon(coupon.vendor, coupon.flyerId)
                       } else {
                        setIsFeedIngPet(true)
                       }
                    }}>
                      <Icon 
                        raised 
                        size={24} 
                        name="dog" 
                        type="font-awesome-5" 
                        color={themes.primary} 
                      />
                    </TouchableOpacity>
                   
                    <Icon 
                      raised 
                      size={24} 
                      name="trash-alt" 
                      type="font-awesome-5" 
                      color={themes.primary}
                      onPress={()=> {
                        console.log("delete")
                        updateStashedFlyers({variables: {residentName, flyerId: coupon.flyerId}})
                        const index = _.findIndex(originalCouponPagesStashed, couponIndex => {
                            return couponIndex.flyerId == coupon.flyerId
                          })
                          originalCouponPagesStashed.splice(index, 1)
                      }} 
                    />
                    </View>
            </Card>
          </View>)
        })}
         <ActivityIndicator size="large" color="#B39DDB" animating={seletFlyerLoading}/>  
      </ScrollView>   

      
      <Overlay
      isVisible={isFlyerReviewOpen}
      onBackdropPress={toggleOverlay}
      overlayStyle={{width: width * 0.8, height: height * 0.8}}
      >
        <PagesPreview 
        flyersToReview={flyersToReview}
        navigation={navigation}
        setIsFlyerReviewOpen={setIsFlyerReviewOpen}
        />

      </Overlay>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  cardStyle: {
    borderRadius: 5,
    shadowColor: "#212121",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 50,
    paddingTop: 20
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subLogoContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%"
  },

  subInfoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "60%"
  },

  iconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },

});
export default CouponScreenStash;
