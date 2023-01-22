import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Card, Text, Icon, Overlay, Input, Button } from 'react-native-elements'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import moment from 'moment';
import _ from 'lodash'

import themes from '../assets/themes';
import { ORDER_STATUS_CHANGED, VENDOR_ORDER_ADDED, VENDOR_SETTLEMENT_RECORD_ADDED } from '../queries/queries_subscription';
import { SEND_MESSAGE, FULFILL, CONFIRM } from '../queries/queries_mutation'


const { height, width } = Dimensions.get("window");



const CustomerOrders = (props) => {
    const { vendorOrders, navigation, vendor, settlementRecords } = props
    
    console.log('orders in customer orders', vendorOrders)
    // const [items, setItems] = useState()
    const [orders, setOrders] = useState(_.orderBy(vendorOrders, ['date'], ['desc']))
    const [records, setRecords] = useState(settlementRecords)
    const [receiver, setReceiver] = useState()
    const [title, setTitle] = useState()
    const [fullName, setFullName] = useState()
    const [message, setMessage] = useState('')
    const [isMsgOverlayOpen, setIsMsgOverlayOpen] = useState(false)
    const [changed, setChanged] = useState(false)
    const [orderToFulfill, setOrderToFulfill] = useState()
    const [isFulfillOrderOpen, setIsFulfillOrderOpen] = useState(false)
    const [fulfillNote, setFulfillNote] = useState('')
    

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
    
   

    //  const isOpen = (items) => {
    //   let result = false
    //   // console.log('items', items)
    //   for ( let singleItem of items ) {
    //     result = singleItem.isFulfilled 
    //     if (result) break 
    //   }
    //   return result ? 'No' : 'Yes'
    // }

    const formatCurrencyAmount = (value) => {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        maximumFractionDigits: 2, 
        minimumFractionDigits: 2,
    // roundingIncrement: 5  
      }).format(value)
    }

    const toggleMsgOverlay = () => {
      setMessage('')
      setIsMsgOverlayOpen(false)
      setIsFulfillOrderOpen(false)
     };

    const [sendMessage] = useMutation(SEND_MESSAGE)
    const [fulfill] = useMutation(FULFILL)
    const [confirm] = useMutation(CONFIRM)


    useSubscription(ORDER_STATUS_CHANGED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { orderStatusChanged }} = subscriptionData
        //  console.log('vendorOrderStatusChanged',vendorOrderStatusChanged)
        const { vendor: orderVendor, resident, orderNo, content, isUnderDispute, isConfirmed, isCanceled } = orderStatusChanged

        if(vendor==orderVendor) {
          const index = orders.findIndex(order => order.orderNo == orderNo )
          if(index >= 0) {
            const orderList = [...orders]
            orderList[index].isCanceled = isCanceled
            orderList[index].isUnderDispute = isUnderDispute
            orderList[index].isConfirmed = isConfirmed
            orderList[index].disputeInfo = content
            
            setOrders(orderList)
            setChanged(!changed)
          }       
          
          
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
          const orderList = [...orders]
          orderList.push(vendorOrderAdded)
          setOrders(_.orderBy(orderList, ['date'], ['desc']))
        }
      }
  })


  useSubscription(VENDOR_SETTLEMENT_RECORD_ADDED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { vendorSettlementRecordAdded }} = subscriptionData
        // console.log('vendorOrderAdded', vendorOrderAdded)
        if(vendor==vendorSettlementRecordAdded.vendor) {
          // const newOrders = [...orders]
          // newOrders.push(vendorOrderAdded)
          const list = [...records]
          list.push(vendorSettlementRecordAdded)
          setRecords(list)
        }
      }
  })

// guild deal status overlay window
  const renderItems = ({ item, i }) => {
    
    return (
      
    <TouchableOpacity
      onPress={()=>{
        const index = settlementRecords.findIndex(record => record.salesOrderNo == item.orderNo)

       navigation.navigate('SingleOrder', { order: item, vendor, record: settlementRecords[index] })
      }}
    >
        <Card containerStyle={styles.card}>
          <View style={styles.orderNoContainer}>
            <Card.Title style={{textAlign: 'left', marginVertical: 10, marginLeft: 5, color: themes.accent}}>{item.orderNo}</Card.Title>
          </View>
               
               {/* customer */}
               <View style={styles.customer}>
                  <Text style={{marginRight: 10}}>Customer:&nbsp;{item.resident + '(' + item.customerName + ')'}</Text>
                  <TouchableWithoutFeedback 
                    onPress={()=> {
                      setReceiver(item.resident)
                      setFullName(item.customerName)
                      setTitle(item.orderNo)
                      setIsMsgOverlayOpen(!isMsgOverlayOpen)
                      setMessage('')
                    }}>
                  <Icon type='material' name='message' color={themes.primary} size={20}/>
                  </TouchableWithoutFeedback>
                </View>
              {/* amount */}
               <View style={styles.content}>
                 <Text>Items:&nbsp;{item.orderItems.length.toString()}</Text>
                 <Text>Amount:&nbsp;{formatCurrencyAmount(item.totalAmount - item.totalDiscount + item.shipping + item.tax)}</Text>
               </View>

               {/* Confirm and Fulfill */}
                   <View style={styles.checkbox}> 
                    <Button 
                    size={10} 
                    type='clear'
                    buttonStyle={{color: themes.secondary}}
                    title={item.isConfirmed?'CONFIRMED':'Confirm'}
                    // disabledStyle={{ backgroundColor: "#ECEFF1"}}
                    titleStyle={{fontSize: 11, color: themes.primary}}

                    disabledTitleStyle={{color: themes.fontColor }}
                    disabled={item.isCanceled||item.isConfirmed}
                    onPress={()=> {
                      const index = orders.findIndex(order => item.orderNo == order.orderNo)
                      const orderList = [...orders]
                      orderList[index].isConfirmed = !orderList[index].isConfirmed
                      setOrders(orderList)
                        confirm({ variables: {
                          vendor: item.vendor,
                          resident: item.resident,
                          orderNo: item.orderNo,
                          content: '',
                          isUnderDispute: item.isUnderDispute,
                          isConfirmed: true,
                          isCanceled: item.isCanceled
                        }})
                    }}
                    />
                    <Button
                    size={10} 
                    type='clear'
                    buttonStyle={{color: themes.secondary}}
                    title={item.isFulfilled?'FULFILLED':'fulfill'} 
                    // disabledStyle={{ backgroundColor: "#ECEFF1"}}
                    titleStyle={{fontSize: 11, color: themes.primary}}
                    disabledTitleStyle={{color: themes.fontColor }}
                    disabled={item.isFulfilled||item.isCanceled}
                    onPress={()=> {
                      setOrderToFulfill(item)
                      setIsFulfillOrderOpen(true)
                    }}
                    />
                    </View>

              {/* Order Status */}
                    {/* <View >
                    <v-btn text plain x-small color="accent" class="mx-2" v-if="item.isUnderDispute">Disputed</v-btn>
                    <v-btn text plain x-small  class="mx-2" color="accent" v-if="item.isCanceled">Canceled</v-btn>
                    </View> */}
              {/* date */}
               <View style={styles.content}>
                 <Text>Date:&nbsp;{moment(new Number(item.date)).format('YYYY-MM-DD HH:mm')}</Text>
                 {item.isUnderDispute&&
                  <Text style={{color: themes.accent, fontSize: 10}}>DISPUTED</Text>
                 }
                 {item.isCanceled&&
                  <Text style={{color: themes.accent, fontSize: 10}}>CANCELED</Text>
                 }
               </View>

             
        </Card>
    </TouchableOpacity>
    
  )};

    return (
      
        <View style={{justifyContent: 'flex-start', alignItems: 'center', height: '100%', }}>
          {orders&&records&&
          <FlatList 
               data={orders}
               renderItem={renderItems}
               keyExtractor={item => item.orderNo} 
               extraData={changed}
               refreshing={true}
               showsVerticalScrollIndicator={false}
          /> 
          }
           {orders.length==0&&
                (<View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon 
                        name='file-tray-outline'
                        type='ionicon'
                        size={80}
                        color={themes.shade4}
                    />
                    <Text style={{ fontFamily: 'mr900', fontSize: 22, color: themes.shade4, fontWeight: 'bold'}}>No Orders</Text>
                </View>)
            }
          
      {/* message overlay */}
      <Overlay 
        isVisible={isMsgOverlayOpen} 
        onBackdropPress={toggleMsgOverlay}
        overlayStyle={{width: width * 0.8}}>
        <Card>
          <Card.Title>Reply:&nbsp;{fullName}</Card.Title>

          <Input
            multiline={true}
            numberOfLines={20}
            onChangeText={(text) => setMessage(text)}
            value={message}
            placeholder='Message'
            style={{ height:100, textAlignVertical: 'top',}} 
          />
          <View>
          <Button
            icon={{ name: "done", type: "material", color: "white" }}
            iconRight
            onPress={() => {
                sendMessage({ variables: {sender: vendor,
                                          receiver,
                                          receiverType: 'resident',
                                          text: message,
                                          time: Date.now().toString(),
                                          fullName: fullName,
                                          guild: '',
                                          title}})
                setIsMsgOverlayOpen(false)
            }}
            title="Ok"
            disabled={!message}
            disabledStyle={{ backgroundColor: "#ECEFF1"}}
            disabledTitleStyle={{color: "#ECEFF1" }}
            buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
                width: '90%'
            }}
            />
          </View>
        </Card>
      </Overlay>


      {/* Fulfill order */}
      {orderToFulfill&&
       <Overlay 
        isVisible={isFulfillOrderOpen} 
        onBackdropPress={toggleMsgOverlay}
        overlayStyle={{width: width * 0.8}}>
        <Card>
          <Card.Title>Order:&nbsp;{orderToFulfill.orderNo}</Card.Title>
          <Input
            multiline={true}
            numberOfLines={20}
            onChangeText={(text) => setFulfillNote(text)}
            value={fulfillNote}
            placeholder='leave a note'
            style={{ height:100, textAlignVertical: 'top',}} 
          />
          <View>
          <Button
            icon={{ name: "done", type: "material", color: "white" }}
            iconRight
            onPress={() => {
              const index = orders.findIndex(order => orderToFulfill.orderNo == order.orderNo)
              const orderList = [...orders]
              orderList[index].isFulfilled = !orderList[index].isFulfilled
              setOrders(orderList)
               fulfill({variables:{
                vendor: orderToFulfill.vendor,
                orderNo: orderToFulfill.orderNo,
                fulfillNote
              }})
              setIsFulfillOrderOpen(false)
            }}
            title="Ok"
            disabled={!fulfillNote}
            disabledStyle={{ backgroundColor: "#ECEFF1"}}
            disabledTitleStyle={{color: "#ECEFF1" }}
            buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
                width: '90%'
            }}
            />
          </View>
        </Card>
      </Overlay>
      }
     
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
      // borderColor: '#7986CB',
      shadowOpacity: 0.2,
      borderRadius: 5,
       shadowColor: "#212121",
       shadowRadius: 3,
       shadowOffset: { width: 0, height: 1 },
      paddingHorizontal: 1
    },
    checkbox: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
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
      backgroundColor: themes.shade4,
      marginTop: -15,
      justifyContent: 'center'
    }
})

export default CustomerOrders