import React, {} from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Text, Icon, Image } from 'react-native-elements'

import { eventPics } from "../assets/constData";

const { height, width } = Dimensions.get("window");
const cardGap = 0;
const cardWidth = (width - cardGap * 1) / 2;
const cardHeight = height / 3.7

const Showcase = (props) => {
    const { itemCatalog,  navigation, vendor} = props 
    console.log('itemCatalog', itemCatalog)

// guild deal status overlay window
  const renderItems = ({ item, i }) => (
    <TouchableOpacity
      onPress={()=>{navigation.navigate('SingleItem', { singleItem: item, vendor })}}
    >
        <Card containerStyle={{
                              marginLeft: i % 2 !== 0 ? -15 : 0,
                              marginTop: 0,
                              width: cardWidth,
                              height: cardHeight,
                              backgroundColor: 'white',
                              borderColor: 'white'
                            }}
                            >
                <Card.Image
                  source={{ uri: item.photo}}
                  // style={{padding: 1}}
                >
                   {item.promoRate>0&&<Image 
                      source={eventPics[0].uri}
                      resizeMode='contain'
                      style={styles.eventTypeImg}
                    /> } 
                </Card.Image>

                  { item.rewardSilver>0 && 
                  <View style={styles.contentContainer}>
                      <Icon name='coins' type="font-awesome-5" size={16}
                          color="#757575"> </Icon>
                        <Text>&nbsp;{item.rewardSilver}</Text>   
                  </View>}
                  
                  <View style={styles.priceContainer}>
                      <Text style={styles.description} ellipsizeMode='tail' numberOfLines={1}>{item.description}</Text>
                      {item.promoRate>0&&(
                        <View style={styles.price}>
                          <Text style={styles.promoRate}>${item.promoRate}&nbsp;&nbsp;</Text>
                          <Text style={styles.rateLine}>${item.rate}</Text>
                        </View>
                        
                      )}
                      {!item.promoRate>0&&
                          <Text style={styles.rate}>$&nbsp;{item.rate}</Text>
                      }
                  </View>
        </Card>
    </TouchableOpacity>
    
  );

    return (
        <View style={{marginLeft: 8, height: '100%'}}>
            <FlatList 
               data={itemCatalog}
               renderItem={renderItems}
               keyExtractor={item => item.itemCode} 
               showsVerticalScrollIndicator={false}
               numColumns={2}
             /> 
        </View>
    )
}

const styles = StyleSheet.create({
 
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
    },

    description: {
      fontSize: 14,
      fontWeight: 'bold',
      width: cardWidth / 2.5
    },

    eventTypeImg: {
        top: -10,
        left: -10,
        height: 70,
        width: 70,
      },

    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },

    price: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },

    promoRate: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: 16
    },

    rate: {
      fontWeight: '100',
      fontSize: 14,
      fontWeight: 'bold'
    },

    rateLine: {
      fontWeight: '100',
      fontSize: 14,
      textDecorationLine: 'line-through'
    },
})

export default Showcase