import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, TouchableWithoutFeedback, DeviceEventEmitter} from 'react-native'
import { Card, Icon, Avatar, SpeedDial, Rating, ListItem, Divider, Overlay, Input, Button} from 'react-native-elements'
import { Picker } from "@react-native-community/picker";
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment'
import _ from 'lodash'

import themes from "../../assets/themes";
import { GET_SINGLE_ITEM_RATING, GET_AUTH, GET_CURRENT_RESIDENT, GET_SHOPPING_CART} from '../../queries/queries_query';
import { SAVE_SINGLE_ITEM_RATING, SAVE_SHOPPING_CART, SET_SHOPPING_CART_COUNT} from '../../queries/queries_mutation'

const { height, width } = Dimensions.get("window");

const SingleItemScreen = ({ navigation, route }) => {
    const { singleItem, vendor } = route.params
    const qty = []
    for(let i = 1; i <= 20; ++i ) {
      qty.push(i.toString())
    }

    const [customerReview, setCustomerReview] = useState()
    const [quantity, setQuantity] = useState(1)
    const [qtySelection, setQtySelection] = useState(qty)
    const [visible, setVisible] = useState(false)
    const [rating, setRating] = useState(0)
    const [runGetShoppingCartTimes, setRunGetShoppingCartTimes] = useState(0)
    const [shoppingCartItems, setShoppingCartItems] = useState()
    const [singleItemRating, setSingleItemRating] = useState()
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [isRatingOverlayOpen, setIsRatingOverlayOpen] = useState(false)
    const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false)
    const [isSameVendor, setIsSameVendor] = useState(true)
    // console.log('singleItem', singleItem)
    // console.log('vendor', vendor)

    

    const toggleOverlay = () => {
      setCustomerReview('')
      setIsRatingOverlayOpen(!isRatingOverlayOpen)
    };

    const toggleCartOverlay = () => {
      setQuantity(1)
      setIsCartOverlayOpen(!isCartOverlayOpen)
    };

    const { data, loading, error } = useQuery(GET_AUTH )
    const { data: residentData, loading: residentLoading, error: residentError } = useQuery(GET_CURRENT_RESIDENT)

    const [getShoppingCart] = useLazyQuery(GET_SHOPPING_CART, {
      async onCompleted ({getShoppingCart}) {
        console.log('shoppingcart', getShoppingCart)
        // setShoppingCartItems(getShoppingCart)
        if (getShoppingCart.length>0&&getShoppingCart[0].vendorName != vendor.vendor) {
          setIsSameVendor(false)
        }
      },
      fetchPolicy: 'cache-and-network'
     })


    useQuery(GET_SINGLE_ITEM_RATING, {
      variables: { vendor: vendor.vendor, itemCode: singleItem.itemCode },
      onCompleted({ getSingleItemRating }) {
        setSingleItemRating(getSingleItemRating)
        console.log('singleItemRating', getSingleItemRating)
      },
      fetchPolicy: 'cache-and-network'
    })

    const [setShoppingCartCount] = useMutation(SET_SHOPPING_CART_COUNT)

    const [saveSingleItemRating] = useMutation(SAVE_SINGLE_ITEM_RATING, {
      async onCompleted({ saveSingleItemRating }) {
        console.log('saveSingleItemRating', saveSingleItemRating)
        setSingleItemRating(saveSingleItemRating)
        console.log('singleItemRating', singleItemRating)
      }
    })

    const [saveShoppingCart] = useMutation(SAVE_SHOPPING_CART, {
      async update( cache, { data: { saveShoppingCart }}) {
        console.log('saveShoppingCart',saveShoppingCart)
        const data = cache.readQuery({query:GET_SHOPPING_CART, variables: { resident: residentData.getCurrentResident.residentName}})
        console.log('get shopping cartdata', data)
        if(data.getShoppingCart.length>0) {
          const index = _.findIndex(data.getShoppingCart, item => {
            return saveShoppingCart.itemCode == item.itemCode
          })
          if ( index >= 0 ) {
            data.getShoppingCart[index].quantity = saveShoppingCart.quantity + data.getShoppingCart[index].quantity
          } else {
            data.getShoppingCart.push(saveShoppingCart)
          }
        } else {
          data.getShoppingCart.push(saveShoppingCart)
        }
        cache.writeQuery({query: GET_SHOPPING_CART, 
                          variables: { resident: residentData.getCurrentResident.residentName},
                          data
                        })
        console.log('singleitemscreen')
        setShoppingCartCount( {variables: { count: data.getShoppingCart.length}})
        DeviceEventEmitter.emit('loadShoppingCart', { shoppingCartList: data.getShoppingCart})             
      },
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   saveShoppingCart: {
      //     __typename: 'ShoppingCartItem',
      //     vendorName: vendor.vendor,
      //     vendorLogo: vendor.logo,
      //     photo: singleItem.photo,
      //     taxRate: singleItem.taxRate,
      //     itemCode: singleItem.itemCode,
      //     description: singleItem.description,
      //     quantity: Number(quantity),
      //     rewardSilver: singleItem.rewardSilver,
      //     rate: singleItem.rate,
      //     promoRate: singleItem.promoRate
      //   }
      // },
      refetchQueries:[{ 
                      query: GET_SHOPPING_CART,
                      variables: { resident: residentData.getCurrentResident.residentName } 
                    }]
    })

    useEffect(()=>{
      if (residentData) {
        const {residentName} = residentData.getCurrentResident
        if(runGetShoppingCartTimes==0) {
          getShoppingCart({ variables: { resident: residentName}})
          setRunGetShoppingCartTimes(1)
        }
      }
    }, [residentData, residentLoading])

    const ratingCompleted = (finalRating) => {
      console.log('Rating is: ' + finalRating);
      const newRating = Math.floor(finalRating) == Math.round(finalRating) 
                        ? Math.floor(finalRating)
                        : Math.round(finalRating) + 0.5 >= 5 ? 5 : Math.round(finalRating)
      console.log('new rating', newRating)                 
      setRating(newRating)
    };

    const ratingFace = (rating) => {
        if(rating <= 2) {
        return <Icon name='frown' size={28} type='font-awesome-5' color='red'/>
        }
        if(rating > 2 && rating < 4) {
          return <Icon name='meh' size={28} type='font-awesome-5' color='gold'/>
        }
        if(rating >= 4) {
          return <Icon name='smile' size={28} type='font-awesome-5' color='green'/>
        }
    }
    
    return (
      
      <View style={{flex: 1}}>
         <ScrollView style={{height: height * 1.5}}>
         {/* item card */}
        <Card>
          <View style={styles.title}>
            <Avatar source={{ uri: vendor.logo }} avatarStyle={{borderRadius: 5, borderColor: '#fff', borderWidth: 1 }}/>
            <Card.Title style={{fontSize: 18, color: themes.primary, marginTop: 10}}>
              &nbsp;&nbsp;{vendor.vendor}
            </Card.Title>
          </View>
            <Card.Image 
                source={{ uri: singleItem.photo}}
                resizeMode='contain'
                style={styles.cardContainer}
            />
            {/* price container */}
            <Card style={styles.cardContainer} containerStyle={{borderColor: '#fff', borderWidth: 0}}>
              <Text style={styles.description} ellipsizeMode='tail' numberOfLines={1}>{singleItem.description}</Text>
              <View style={styles.priceContainer}>
                        
                        {singleItem.promoRate>0&&(
                          <View style={styles.price}>
                            <Text style={styles.promoRate}>${singleItem.promoRate}&nbsp;&nbsp;</Text>
                            <Text style={styles.rateLine}>${singleItem.rate}</Text>
                            <Icon 
                              name="coins"
                              type="font-awesome-5"
                              color="#757575"
                              style={{marginLeft: 20}}
                              size={14}
                          />
                          <Text style={styles.rewardSilver}>&nbsp;{singleItem.rewardSilver}</Text>
                          </View>
                          
                        )}
                        {!singleItem.promoRate>0&&(
                          <View style={styles.price}>
                            <Text style={styles.rate}>$&nbsp;{singleItem.rate}</Text>
                            <Icon 
                              name="coins"
                              type="font-awesome-5"
                              color="#757575"
                              style={{marginLeft: 20}}
                              size={14}
                          />
                          <Text style={styles.rewardSilver}>&nbsp;{singleItem.rewardSilver}</Text>
                          </View>
                        )}
              </View>
              {/* specification */}
              <Card containerStyle={{borderColor: '#fff', borderWidth: 0}}>
                <Card.Title>{singleItem.specification}</Card.Title>
              </Card>
            </Card>
        </Card>
        {/* customer review */}
        {singleItemRating!=null&&(<Card>
              <View style={styles.review}>
                <View>
                  <View>{ratingFace(singleItemRating.averageRating)}</View>
                  <Rating
                  type="star"
                  fractions={20}
                  imageSize={18}
                  style={{ paddingVertical: 10 }}
                  readonly
                  startingValue={singleItemRating.averageRating}
              />
                </View>
                <TouchableWithoutFeedback 
                  onPress={()=>setIsReviewOpen(!isReviewOpen)}
                  disabled={!singleItemRating}>
                  <Icon name={isReviewOpen?'chevron-up':'chevron-down'} type='font-awesome-5' size={18}/>
                </TouchableWithoutFeedback>
              </View>
              {/* cstomer review */}
              {isReviewOpen&&singleItemRating!=null&&(
                <View>
                  <Divider />
                  {singleItemRating!=null&&
                    singleItemRating.customerRatings.map((item, i) => {
                      return (
                        <ListItem key={i} bottomDivider>
                        <Avatar source={{uri: item.customerAvatar}} rounded size={30}/>
                        <ListItem.Content>
                          <ListItem.Title style={{fontSize: 16}}>{item.customerName}</ListItem.Title>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', fontSize: 8}}>
                          <Rating
                              type="star"
                              fractions={20}
                              imageSize={10}
                              style={{ paddingVertical: 10, fontSize: 8 }}
                              readonly
                              startingValue={item.rating}
                          />
                          <Text style={{fontSize: 10}}>{moment(Number(item.time)).format("YYYY-MM-DD")}</Text>
                          </View>
                          <ListItem.Subtitle style={{fontSize: 12}} numberOfLines={3}
                          >{item.comments}</ListItem.Subtitle>
                        </ListItem.Content>
                      </ListItem>
                      )
                    }) 
                  }
                </View>)}
        </Card>)}
        
        
        </ScrollView> 
     
    {/* <FAB
          visible={visible}
          icon={{ name: 'add', color: 'white' }}
          color="green"
          style={{position:'absolute',bottom: 10, right: 10, alignSelf:'flex-end'}}
        /> */}
        
        <SpeedDial
          isOpen={visible}
          icon={{ name: 'menu-open', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => setVisible(!visible)}
          onClose={() => setVisible(!visible)}
        >
          {data.auth.isAuthed&&<SpeedDial.Action
            icon={{ name: 'star', color: '#fff' }}
            title="Rating"
            onPress={() => 
              {
                setCustomerReview('')
                setVisible(!visible)
                setIsRatingOverlayOpen(true)
                setRating(0)
              }}
          />}
          
          <SpeedDial.Action
            icon={{ name: 'attach-money', color: '#fff' }}
            title="Buy"
            onPress={() => console.log('Add Something')}
          />
          <SpeedDial.Action
            icon={{ name: 'favorite-outline', color: '#fff' }}
            title="Favor"
            onPress={() => console.log('Add Something')}
          />
          {data.auth.isAuthed&&<SpeedDial.Action
            icon={{ name: 'add-shopping-cart', color: '#fff' }}
            title="Shopping Cart"
            onPress={() => {
              setVisible(!visible)
              setIsCartOverlayOpen(true)
              setQuantity(1)
            }}
          />}
          
        </SpeedDial>

      {/* rating overlay */}
      <Overlay 
        isVisible={isRatingOverlayOpen} 
        onBackdropPress={toggleOverlay}
        overlayStyle={{width: width * 0.8}}>
        <Card>
          <View>{ratingFace(rating)}</View>
          <Rating
            type="star"
            fractions={20}
            imageSize={30}
            style={{ paddingVertical: 10 }}
            startingValue={0}
            onFinishRating={ratingCompleted}
          />
          <Input
            multiline={true}
            numberOfLines={20}
            onChangeText={(text) => setCustomerReview(text)}
            value={customerReview}
            label='comments'
            style={{ height:100, textAlignVertical: 'top',}} 
          />
          <View>
          <Button
            icon={{ name: "done", type: "material", color: "white" }}
            iconRight
            onPress={() => {
                saveSingleItemRating({ variables: {itemCode: singleItem.itemCode,
                                                  vendor: vendor.vendor,
                                                  residentId: residentData.getCurrentResident._id,
                                                  rating: rating,
                                                  comments: customerReview,
                                                  time: Date.now().toString()
                                                }})
                setIsRatingOverlayOpen(false)
            }}
            title="Ok"
            disabled={ rating == 0 }
            disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
            buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
                width: '90%'
            }}
            />
          </View>
        </Card>
      </Overlay>

      {/* shopping cart overlay */}
      <Overlay 
        isVisible={isCartOverlayOpen} 
        onBackdropPress={toggleCartOverlay}
        overlayStyle={{width: width * 0.8}}>
        <Card>
            <Card.Title>Quantity</Card.Title>
            <Card.Divider />
            <Picker
              selectedValue={quantity}
              placeHolder='Order Qty'
              style={{
                height: 100,
                width: width * 0.6,
                backgroundColor: "white",
                marginBottom: 100,
                marginTop: -30
              }}
              onValueChange={(itemValue, itemIndex) => {
                setQuantity(itemValue);
                console.log(itemValue);
              }}
            >
              {qtySelection.map((g, i) => (
                <Picker.Item key={i} label={g} value={g} />
              ))}
            </Picker>
          <View>
          <Button
            icon={{ name: "done", type: "material", color: "white" }}
            iconRight
            onPress={() => {
              saveShoppingCart({ variables: {
                                resident: residentData.getCurrentResident.residentName,
                                itemCode: singleItem.itemCode,
                                vendor: vendor.vendorId,
                                description: singleItem.description,
                                quantity: Number(quantity),
                                rewardSilver: singleItem.rewardSilver,
                                rate: singleItem.rate,
                                promoRate: singleItem.promoRate}})
                setIsCartOverlayOpen(false)                
            }}
            title="Ok"
            disabled={ quantity == 0 || !isSameVendor }
            disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
            buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
                width: '90%'
            }}
            />
          </View>
        </Card>
      </Overlay>

      </View>
    )
}

 const styles = StyleSheet.create({
     cardContainer: {
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
     },

    description: {
        fontSize: 16,
        fontWeight: 'bold',
        width: '100%',
        marginVertical: 10,
        textAlign: 'center'
      },

    price: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },

      priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 10
      },
  
      promoRate: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 24
      },
  
      rate: {
        fontWeight: 'bold',
        fontSize: 14,
      },
  
      rateLine: {
        fontWeight: '100',
        fontSize: 14,
        textDecorationLine: 'line-through'
      },

      rewardSilver: {
        fontWeight: '300',
        fontSize: 14,
      },

      review: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
      },

      title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
      }
 })

export default SingleItemScreen