import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, DeviceEventEmitter } from 'react-native'
import { Card, SpeedDial, Icon } from 'react-native-elements'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Picker } from "@react-native-community/picker";
import _ from 'lodash'


import { GET_SHOPPING_CART, GET_CURRENT_RESIDENT, GET_AUTH } from '../../queries/queries_query'
import { UPDATE_SHOPPING_CART, SET_SHOPPING_CART_COUNT } from '../../queries/queries_mutation'

const { height, width } = Dimensions.get("window");


const ShoppingCartScreen = ({ navigation }) => {

  const qty = []
    for(let i = 1; i <= 20; ++i ) {
      qty.push(i.toString())
    }

  const [getShoppingCartTimes, setGetShoppingCartTimes] = useState(0)
  const [cartUpdate, setCartUpdate] = useState({itemCode: null, quantity: 0})
  // const [qtySelection, setQtySelection] = useState(qty)
  const [quantity, setQuantity] = useState([])
  const [residentName, setResidentName] = useState()
  const [shoppingCartItems, setShoppingCartItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [listenerNo, setListenerNo] = useState(0)
  
  
  
  useEffect(() => {
    // if (listenerNo == 0) {
       DeviceEventEmitter.addListener('loadShoppingCart', value => {
      // const { itemLoaded } = value
      // console.log('itemLoaded', itemLoaded)
      //   const items = [...shoppingCartItems]
      //   items.push(itemLoaded)
      //   setShoppingCartItems(items)
      //   const qty = [...quantity]
      //   qty.push(itemLoaded.quantity.toString())
      //   setQuantity(qty)
      // if(residentName) {
      //    getShoppingCart({ variables: { resident: residentName}})
      // }
      const { shoppingCartList } = value
       setShoppingCartItems(shoppingCartList)
    })
  // setListenerNo(1)
    // }
 
    return () => {
      DeviceEventEmitter.removeListener('loadShoppingCart')
    }
  }, [])

  // const { data, loading, error } = useQuery(GET_AUTH )

  // const { data: residentData, loading: residentLoading } = 
  useQuery(GET_CURRENT_RESIDENT, {
       async onCompleted ({getCurrentResident}) {
          const { residentName } = getCurrentResident
          setResidentName(residentName)
       },
      fetchPolicy: "cache-and-network",
    });

  const [getShoppingCart] = useLazyQuery(GET_SHOPPING_CART, {
  async onCompleted ({getShoppingCart}) {
      console.log('shoppingcart', getShoppingCart)
      const itemQuantity = getShoppingCart.map((item,i) => {
        return item.quantity.toString()
      })
      setQuantity(itemQuantity)
      setShoppingCartItems(getShoppingCart)      
      // console.log('quantity', quantity) 
  },
  fetchPolicy: 'cache-and-network'
  })

  const [setShoppingCartCount] = useMutation(SET_SHOPPING_CART_COUNT)
  
  const [updateShoppingCart] = useMutation(UPDATE_SHOPPING_CART, {
    async update(cache, { data: { updateShoppingCart }}) {
      const shoppingCart = [...shoppingCartItems]
      const {itemCode, quantity} = updateShoppingCart

          if (itemCode == null) {
            setShoppingCartItems([])
            return
          }
          const index = _.findIndex(shoppingCart, item => {
            return item.itemCode == itemCode
          })
          if (quantity > 0) {
            shoppingCart[index].quantity = quantity
          } else {
            shoppingCart.splice(index, 1)
            console.log('shoppingcart after update',shoppingCart)
          }
          console.log('shoppingcartscreen')
          // DeviceEventEmitter.emit('updateShoppingCart', { count: shoppingCart.length})
          setShoppingCartCount( {variables: { count: shoppingCart.length}})

          setShoppingCartItems(shoppingCart)
    },
     optimisticResponse: {
          updateShoppingCart: {
            __typename: "UpdateOfShpCat",
            itemCode: cartUpdate.itemCode,
            quantity: cartUpdate.quantity
          },
        },
    // refetchQueries: [{ query: GET_SHOPPING_CART, variables: { resident: residentName}}],
    // awaitRefetchQueries: true
  })


  useEffect(() => {
      if(residentName) {
        console.log('residentName', residentName)
        // const {residentName} = residentData.getCurrentResident
        if(getShoppingCartTimes==0) {
          getShoppingCart({ variables: { resident: residentName}})
          // setGetShoppingCartTimes(1)
        }
        
      }
    }, [residentName])

  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {shoppingCartItems&&shoppingCartItems.length>0&&(
          shoppingCartItems.map((item,i) => {
            return (
                <Card key={i}>
                  <Card.Title>{item.description}</Card.Title>
                  <Card.Image source={{uri: item.photo}} resizeMode='contain' />
                  <Card.Divider style={{marginVertical: 2}}/>
                  {item.promoRate>0&&(
                          <View style={styles.price}>
                            <Text style={styles.promoRate}>${item.promoRate}&nbsp;&nbsp;</Text>
                            <Text style={styles.rateLine}>${item.rate}</Text>
                            <Icon 
                              name="coins"
                              type="font-awesome-5"
                              color="#757575"
                              style={{marginLeft: 20}}
                              size={14}
                            />
                            <Text style={styles.rewardSilver}>&nbsp;{item.rewardSilver}</Text>
                          </View>
                          
                        )}
                        {!item.promoRate>0&&
                            <View style={styles.price}>
                            <Text style={styles.rate}>$&nbsp;{item.rate}</Text>
                            <Icon 
                              name="coins"
                              type="font-awesome-5"
                              color="#757575"
                              style={{marginLeft: 20}}
                              size={14}
                          />
                          <Text style={styles.rewardSilver}>&nbsp;{item.rewardSilver}</Text>
                          </View>
                        }
                        <View style={styles.bottom}>
                         
                          <Card.Title style={{marginTop: 92, fontSize: 20}}>Qty:&nbsp;</Card.Title>
                          <Picker
                            selectedValue={quantity[i]}
                            placeHolder='Order Qty'
                            style={{
                              height: '10%',
                              width: width * 0.2,
                              backgroundColor: "white",
                            }}
                            itemStyle={{fontSize: 16,  color:'black', fontWeight: 'bold', flexDirection: 'row'}}
                            onValueChange={(itemValue, itemIndex) => {
                              // console.log('itemValue', itemValue)
                              // console.log('resident', residentData.getCurrentResident.residentName )
                              if(itemValue==quantity[i]) return
                              const quantityCopy = [...quantity]
                              quantityCopy[i] = itemValue
                              setQuantity(quantityCopy)
                              // console.log('quantity in picker',quantity);
                              const cartUpdate = { itemCode: item.itemCode, quantity: Number(itemValue)}
                              setCartUpdate(cartUpdate)
                              console.log('picker')
                              updateShoppingCart({ variables: {             
                                                                resident: residentName,
                                                                itemCode: item.itemCode,
                                                                quantity: Number(itemValue)
                                                              }})
                            }}
                          >
                            {qty.map((g, i) => (
                              <Picker.Item key={i} label={g} value={g} color='black'/>
                            ))}
                          </Picker>
                          
                        </View>
                        <View style={styles.amount}>
                          <Icon 
                            name='trash-alt' 
                            type='font-awesome-5' 
                            size={18} 
                            color='white'
                            containerStyle={{backgroundColor: '#BDBDBD', padding: 5, marginLeft: -20, borderRadius: 50}}
                            onPress={() => {
                              const cartUpdate = { itemCode: item.itemCode, quantity: 0}
                              setCartUpdate(cartUpdate)
                              console.log('remove item')
                              updateShoppingCart({ variables: { resident: residentName,
                                                                itemCode: item.itemCode,
                                                                quantity: 0}})
                            }}/>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Subtotal:&nbsp;${item.promoRate>0?item.quantity*item.promoRate:item.quantity*item.rate}</Text>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Reward Silver:&nbsp;{item.quantity*item.rewardSilver}</Text>
                            
                          </View>
                </Card>
            )
          })
        )}
        {shoppingCartItems&&shoppingCartItems.length==0&&(
          <Text style={{fontSize: 30, color: 'red', textAlign: 'center'}}>Shopping Cart Is Empty</Text>
        )}
      </ScrollView>
      <SpeedDial
          isOpen={visible}
          icon={{ name: 'menu-open', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => 
            {
              if(shoppingCartItems.length>0)
              {setVisible(!visible)}}}
          onClose={() => setVisible(!visible)}
        >
          <SpeedDial.Action
            icon={{ name: 'cash-register', color: '#fff', type: 'font-awesome-5' }}
            title="Check Out"
            onPress={() => {
              navigation.navigate('Checkout', { shoppingCart: shoppingCartItems, resident: residentName})
              setVisible(!visible)
            }}
          />
          <SpeedDial.Action
            icon={{ name: 'delete-outline', color: '#fff' }}
            title="Clear All"
            onPress={() => 
              { const cartUpdate = { itemCode: null, quantity: 0}
              setCartUpdate(cartUpdate)
              console.log('clear all')
              updateShoppingCart({ variables: { resident: residentName,
                                                itemCode: null,
                                                quantity: 0}})
              setShoppingCartCount({ variables: { count: 0}})
              setVisible(!visible)
              }}
              
          />
        </SpeedDial>
    </View>
      
  )
}

const styles = StyleSheet.create({
  amount: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#BDBDBD',
    padding: 10,
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden'
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center'
  },

  price: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
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
})



export default ShoppingCartScreen