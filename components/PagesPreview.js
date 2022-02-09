import React, {} from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import { Image, ListItem } from "react-native-elements"
import TouchableScale from 'react-native-touchable-scale'

import themes from "../assets/themes";

const { height, width } = Dimensions.get("window");

const PagesPreview = (props) => {
 
  const { flyersToReview, navigation, setIsFlyerReviewOpen } = props

  return (
     <ScrollView showsVerticalScrollIndicator={false}>
      {flyersToReview.length > 0 && (
        flyersToReview.map((flyer,i) => (
          <ListItem 
            key={i} 
            bottomDivider
            Component={TouchableScale}
            friction={90} //
            tension={100} 
            activeScale={0.95}
            onPress={()=>{
              // console.log("to single page")
              // console.log(flyer)
              setIsFlyerReviewOpen(false)
              navigation.navigate("SinglePageReview", {pageToReview: flyer})
            }}
            style={styles.listItemStyle}>
              <ListItem.Content>
                <Image 
                source={{uri: 'data:image/jpeg;base64,' + flyer.base64}}
                resizeMode="contain"
                style={{width: width * 0.7, height: height * 0.2}} />
              </ListItem.Content>
          </ListItem>
        ))
      )}
     </ScrollView>
  );
};

const styles = StyleSheet.create({

  scrollViewContainer: {
   
  },

  listItemStyle: {
     flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: width * 0.8,
    marginVertical: 5
  },


});
export default PagesPreview;
