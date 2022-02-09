import React, {} from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Image, Icon, Divider, Badge,} from "react-native-elements"

import themes from "../assets/themes";

const FeedPet = (props) => {
 
  const { pet, 
    petLevel, 
    petExperience, 
    petExpPosition, 
    animationOpacity, 
    silverPosition, 
    trigerAnimation,  
    setIsFeedIngPet } = props

  return (
     <View style={styles.petContainer}>
       <View style={styles.petInfoContainer}>
         <Text style={styles.petInfo}>Experience: {petExperience.toString()}</Text>
         <Text style={styles.petInfo}>Level: {petLevel}</Text>
       </View>
       <Image 
       source={{uri: pet.petImgUrl}}
       style={{ width: 150, height: 150 }}
       resizeMode="contain"
       />

       {/* Pet Experience */}
       {trigerAnimation && (
         <Animated.View style={{
           position: "absolute",
           transform: [
             {translateX: petExpPosition.x},
             {translateY: petExpPosition.y}
           ],
           opacity: animationOpacity
         }}><Text style={{fontSize:20, fontWeight: "bold", color: "#00E676"}}>+100</Text></Animated.View>
          )}

       {/* Silver Coins */}
       {trigerAnimation && (
         <Animated.View style={{
           position: "absolute",
           transform: [
             {translateX: silverPosition.x},
             {translateY: silverPosition.y}
           ],
           opacity: animationOpacity,
           flexDirection: "column",
           justifyContent: "center",
           alignItems: "center"
         }}>
           <Text style={{fontSize:20, fontWeight: "bold", color: "#FFAB00"}}>+100</Text>
           <Icon 
             name="coins"
             type="font-awesome-5"
             color="#757575"
            />
           </Animated.View>
          )}


       <Badge
        value={<Text style={{ fontSize:16, color: "white", fontWeight: "bold"}}>X</Text>}
        status="primary"
        containerStyle={{ position: 'absolute', top: 40, right: 50 }}
        onPress={()=>{
          setIsFeedIngPet(false)
        }}
        ></Badge>

       <Divider style={{width: "90%", marginVertical: 5}}/>
      </View>
   
  );
};

const styles = StyleSheet.create({

  petContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginVertical: 5
  },

  petInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    width: "80%"
  },

  petInfo: {
    fontSize: 12,
    color: themes.primary
  }


});
export default FeedPet;
