import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Card, Icon, ListItem, CheckBox } from 'react-native-elements'
import {useMutation} from '@apollo/react-hooks'
import moment from 'moment'


import themes from '../../assets/themes';
import { CHANGE_ORDER_STATUS } from '../../queries/queries_mutation'

const { height, width } = Dimensions.get("window");


const SingleOrderScreen = ({navigation, route}) => {
    const { order, vendor, record } = route.params
    console.log('order', order)

    // const isFilled = (items) => {
    //     let result = false
    //     // console.log('items', items)
    //     for ( let singleItem of items ) {
    //       result = singleItem.isFulfilled 
    //       if (result) break 
    //     }
    //     return result 
    //   }
    const formatAmount = (value) => {
        return new Intl.NumberFormat('en-US', {  maximumFractionDigits: 0, minimumFractionDigits: 0,
          roundingIncrement: 5  }).format(value)
      }

      const formatCurrencyAmount = (value) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 2, 
            minimumFractionDigits: 2,
    //   roundingIncrement: 5  
         }).format(value)
      }

    // const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS)
    // const [checked, setChecked] = useState(isFilled(order.orderItems))
    return (
        <View>
            <Card containerStyle={{borderRadius: 5}}>
                <Card.Title style={{fontSize: 16, color: themes.accent, fontWeight: 'bold'}}>{order.orderNo}</Card.Title>
                <Card.Divider />
                {/* customer */}
                <View style={styles.customer}>
                  <Text style={{marginRight: 10}}>Customer:&nbsp;{order.customerName}</Text>
                  {/* <TouchableWithoutFeedback>
                  <Icon type='material' name='message' color={themes.primary} size={20}/>
                  </TouchableWithoutFeedback> */}
                </View>
                <Card.Divider />
              {/* items */}
               <View style={styles.content}>
                 <Text>Items:&nbsp;{order.orderItems.length.toString()}</Text> 
                 <Text>Date:&nbsp;{moment(new Number(order.date)).format('YYYY-MM-DD HH:mm')}</Text>
                 </View>
                <Card.Divider /> 
                    <ScrollView style={{height: height * 0.2 }} 
                    >
                        {order.orderItems.map((item,i) => (
                        <ListItem key={item.itemCode}>
                            <ListItem.Content>
                                <ListItem.Subtitle style={styles.listItem}>{item.itemCode}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Subtitle  style={styles.listItem} numberOfLines={1} ellipsizeMode='tail'>{item.description}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Subtitle style={styles.listItem}>{item.quantity.toString()}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Subtitle style={styles.listAmountItem}>{formatCurrencyAmount(item.unitPrice)}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Subtitle style={styles.listAmountItem}>{formatCurrencyAmount(item.quantity*item.unitPrice)}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                        ))}
                       
                    </ScrollView>
                <Card.Divider />
               
              {/* date */}
              {order.dealsTitle&&order.dealsTitle.length>0&&(
                   <View style={styles.dealAmount}>
                   <Text style={{color: themes.accent}}>{order.dealsTitle[0].title}</Text>
                </View>
              )}
               <View style={styles.amount}>
                  <Text style={{color: themes.accent}}>Discount:&nbsp;-{formatCurrencyAmount(order.totalDiscount )}</Text>
               </View>
               <View style={styles.amount}>
                  <Text>Subtotal:&nbsp;{formatCurrencyAmount(order.totalAmount - order.totalDiscount )}</Text>
               </View>
               <View style={styles.amount}>
                  <Text>Shipping:&nbsp;{formatCurrencyAmount(order.shipping)}</Text>
               </View>
               <View style={styles.amount}>
                   <Text>Tax:&nbsp;{formatCurrencyAmount(order.tax + order.shipping * 0.13 )}</Text>
               </View>
               <View style={styles.amount}>
                   <Text>Total:&nbsp;{formatCurrencyAmount(order.totalAmount - order.totalDiscount + order.tax + order.shipping * 1.13 )}</Text>
               </View>
               <Card.Divider />
               <View style={styles.amount}>
                   <Text>Boundary Gold:&nbsp;{formatAmount(record.boundaryGold)}</Text>
               </View>
               <View style={styles.amount}>
                     <Text>Customer&nbsp;Paid&nbsp;{formatCurrencyAmount(record.amountPaidByCustomer)}&nbsp;by&nbsp;{ order.paymentMethod }</Text>
               </View>
               <View style={styles.amount}>
               <Text>Boundary Payable:&nbsp;{formatCurrencyAmount(record.boundaryPayable)}</Text>
               </View>
               <Card.Divider />
               {order.note!=''&&
                <Text numberOfLines={3} ellipsizeMode='clip' style={{width: '100%',color: themes.fontColor, fontSize: 12, margin: 3}}>
                    Note: &nbsp;{order.note}
                </Text>
               }
               {order.isUnderDispute&&
                <Text numberOfLines={3} ellipsizeMode='clip' style={{width: '100%',color: themes.accent, fontSize: 12, margin: 3}}>
                    Dispute: &nbsp;{order.disputeInfo}
                </Text>
               }
               {order.isFulfilled&&
                <Text numberOfLines={3} ellipsizeMode='clip' style={{width: '100%',color: themes.fontColor, fontSize: 12, margin: 3}}>
                    Fulfill Note: &nbsp;{order.fulfillNote}
                </Text>
               }
               <View style={styles.date}>
                   {order.deliveryType=='pickup'?
                   <Text style={{marginVertical: 5, fontSize: 13}}>Pick Up at:&nbsp;&nbsp;{order.pickupAddress}</Text>:
                   <Text style={{marginVertical: 5, fontSize: 13}}>Dliver To:&nbsp;&nbsp;{order.deliveryAddress}</Text>}
               </View>
               
                 
            </Card>
        </View>

    )
}

const styles = StyleSheet.create({
    amount: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     alignItems: 'center',
     marginRight: 5,
     marginVertical: 5
    },
    dealAmount: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 5,
     marginVertical: 5,
     color: themes.accent
    },
    // card: {
    //   marginHorizontal: 5,
    //   marginVertical: 5,
    //   width: width * 0.9,
    //   height: height / 5,
    //   backgroundColor: 'white',
    //   borderColor: 'white',
    //   borderRadius: 5,
    //   paddingHorizontal: 20
    // },
    
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    customer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 10
    },
    date: {
        justifyContent:'space-around',
        alignItems: 'flex-start'
    },
    listItem: {
        textAlign: 'left',
        fontSize: 12
    },
    listAmountItem: {
        textAlign: 'left',
        fontSize: 12,
        marginLeft: -20
    }
})


export default SingleOrderScreen