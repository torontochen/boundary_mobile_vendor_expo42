import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Card, Text, Icon, Overlay, Input, Button } from 'react-native-elements'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import moment from 'moment';

import themes from '../assets/themes';
import { VENDOR_ORDER_STATUS_CHANGED, VENDOR_ORDER_ADDED } from '../queries/queries_subscription';
import { SEND_MESSAGE } from '../queries/queries_mutation'


const { height, width } = Dimensions.get("window");



const Orders = (props) => {
    const { orders, navigation, vendor } = props
    
    console.log('orders', orders)
    // const [items, setItems] = useState()
    const [receiver, setReceiver] = useState()
    const [message, setMessage] = useState('')
    const [isMsgOverlayOpen, setIsMsgOverlayOpen] = useState(false)
    const [changed, setChanged] = useState(false)

    // useEffect(()=>{
    //   if(orders) {
    //      const orderitems = orders.map(order => {
    //       return order.orderItems.map(item => {
    //         return {...item, orderNo: order.orderNo}
    //       })
    //     })
    //     console.log('orderItems', orderitems)
    //     setItems(orderitems)
    //   }
    // },[orders])
    
   

     const isOpen = (items) => {
      let result = false
      // console.log('items', items)
      for ( let singleItem of items ) {
        result = singleItem.isFulfilled 
        if (result) break 
      }
      return result ? 'No' : 'Yes'
    }

    const toggleMsgOverlay = () => {
      setMessage('')
      setIsMsgOverlayOpen(!isMsgOverlayOpen)
     };

    const [sendMessage] = useMutation(SEND_MESSAGE)


    useSubscription(VENDOR_ORDER_STATUS_CHANGED, {
      onSubscriptionData({subscriptionData}) {
         const { data: { vendorOrderStatusChanged }} = subscriptionData
         console.log('vendorOrderStatusChanged',vendorOrderStatusChanged)
        if(vendor==vendorOrderStatusChanged.vendor) {
          const index = orders.findIndex(order => order.orderNo == vendorOrderStatusChanged.orderNo )
          for(let item of orders[index].orderItems) {
            item.isFulfilled = vendorOrderStatusChanged.status
          }
          // console.log('items',items)
          // const newItems = [...items]
          // const indexItem = newItems.findIndex(item => item.orderNo == vendorOrderStatusChanged.orderNo )
          // for(let item of newItems[indexItem]) {
          //   item.isFulfilled = vendorOrderStatusChanged.status
          // }
          setChanged(!changed)
          // setExistingOrders(orders)
          console.log('orders in subscription', orders)
        }
         
      }
  })

  useSubscription(VENDOR_ORDER_ADDED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { vendorOrderAdded }} = subscriptionData
        console.log('vendorOrderAdded', vendorOrderAdded)
        if(vendor==vendorOrderAdded.vendor) {
          // const newOrders = [...orders]
          // newOrders.push(vendorOrderAdded)
          orders.push(vendorOrderAdded)
        }
      }
  })

// guild deal status overlay window
  const renderItems = ({ item, i }) => {
    
    return (
    <TouchableOpacity
      onPress={()=>{
       navigation.navigate('SingleOrder', { order: item, vendor })
      }}
    >
        <Card containerStyle={styles.card}>
          <View style={styles.orderNoContainer}>
            <Card.Title style={{textAlign: 'left', marginVertical: 10, marginLeft: 5}}>{item.orderNo}</Card.Title>
          </View>
               
               {/* customer */}
               <View style={styles.customer}>
                  <Text style={{marginRight: 10}}>Customer:&nbsp;{item.resident}</Text>
                  <TouchableWithoutFeedback 
                    onPress={()=> {
                      setReceiver(item.customerName)
                      setIsMsgOverlayOpen(!isMsgOverlayOpen)
                      setMessage('')
                    }}>
                  <Icon type='material' name='message' color={themes.primary} size={20}/>
                  </TouchableWithoutFeedback>
                </View>
              {/* amount */}
               <View style={styles.content}>
                 <Text>Items:&nbsp;{item.orderItems.length.toString()}</Text>
                 <Text>Amount:&nbsp;{item.totalAmount.toFixed(2).toString()}</Text>
               </View>
              {/* date */}
               <View style={styles.content}>
                 <Text>Date:&nbsp;{moment(new Number(item.date)).format('YYYY-MM-DD HH:mm')}</Text>
                 <Text>Open:&nbsp;{isOpen(item.orderItems)}</Text>
               </View>

             
        </Card>
    </TouchableOpacity>
    
  )};

    return (
        <View style={{justifyContent: 'flex-start', alignItems: 'center', height: '100%', }}>
          <FlatList 
               data={orders}
               renderItem={renderItems}
               keyExtractor={item => item.orderNo} 
               extraData={changed}
               refreshing={true}
          /> 
           {/* message overlay */}
      <Overlay 
        isVisible={isMsgOverlayOpen} 
        onBackdropPress={toggleMsgOverlay}
        overlayStyle={{width: width * 0.8}}>
        <Card>
          <Input
            multiline={true}
            numberOfLines={20}
            onChangeText={(text) => setMessage(text)}
            value={message}
            label='Message'
            style={{ height:100, textAlignVertical: 'top',}} 
          />
          <View>
          <Button
            icon={{ name: "done", type: "material", color: "white" }}
            iconRight
            onPress={() => {
                sendMessage({ variables: {sender: vendorData.businessTitle,
                                          receiver,
                                          receiverType: 'resident',
                                          text: message,
                                          time: Date.now().toString()
                                                }})
                setIsMsgOverlayOpen(false)
            }}
            title="Ok"
            disabled={!message}
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
 
    card: {
      marginHorizontal: 5,
      // marginVertical: 5,
      width: width * 0.9,
      height: height / 5,
      backgroundColor: 'white',
      borderColor: '#7986CB',
      borderRadius: 5,
      paddingHorizontal: 2
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
    },
    customer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10
    },
    orderNoContainer: {
      width: '100%',
      backgroundColor: '#EDE7F6',
      marginTop: -15,
      justifyContent: 'center'
    }
})

export default Orders