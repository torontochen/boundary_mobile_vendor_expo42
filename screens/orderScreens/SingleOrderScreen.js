import React, {useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, DeviceEventEmitter} from 'react-native'
import { Card, Icon, ListItem, CheckBox } from 'react-native-elements'
import {useMutation} from '@apollo/react-hooks'
import moment from 'moment'


import themes from '../../assets/themes';
import { CHANGE_ORDER_STATUS } from '../../queries/queries_mutation'

const { height, width } = Dimensions.get("window");


const SingleOrderScreen = ({navigation, route}) => {
    const { order, vendor } = route.params
    console.log('order', order)

    const isFilled = (items) => {
        let result = false
        // console.log('items', items)
        for ( let singleItem of items ) {
          result = singleItem.isFulfilled 
          if (result) break 
        }
        return result 
      }

    const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS)
    const [checked, setChecked] = useState(isFilled(order.orderItems))
    return (
        <View>
            <Card>
                <Card.Title>{order.orderNo}</Card.Title>
                <Card.Divider />
                {/* customer */}
                <View style={styles.customer}>
                  <Text style={{marginRight: 10}}>Customer:&nbsp;{order.resident}</Text>
                  <TouchableWithoutFeedback>
                  <Icon type='material' name='message' color={themes.primary} size={20}/>
                  </TouchableWithoutFeedback>
                </View>
                <Card.Divider />
              {/* items */}
               <View style={styles.content}>
                 <Text>Items:&nbsp;{order.orderItems.length.toString()}</Text> 
                 <Text>Date:&nbsp;{moment(new Number(order.date)).format('YYYY-MM-DD HH:mm')}</Text>
                 </View>
                <Card.Divider /> 
                    <ScrollView style={{height: height * 0.25 }} 
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
                                <ListItem.Subtitle style={styles.listItem}>${item.unitPrice.toFixed(2).toString()}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Subtitle style={styles.listItem}>${item.quantity*item.unitPrice.toFixed(2).toString()}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                        ))}
                       
                    </ScrollView>
                <Card.Divider />
               
              {/* date */}
               <View style={styles.amount}>
                  <Text>Subtotal:&nbsp;{order.totalAmount.toFixed(2).toString()}</Text>
               </View>
               <View style={styles.amount}>
                   <Text>Tax:&nbsp;{order.tax.toFixed(2).toString()}</Text>
               </View>
               <View style={styles.amount}>
                   <Text>Total:&nbsp;{(order.tax+order.totalAmount).toFixed(2).toString()}</Text>
               </View>
               <Card.Divider />
               <View style={styles.date}>
                   {order.deliveryType=='pickup'?
                   <Text style={{marginVertical: 5, fontSize: 13}}>Pick Up at:&nbsp;&nbsp;{order.pickupAddress}</Text>:
                   <Text style={{marginVertical: 5, fontSize: 13}}>Dliver To:&nbsp;&nbsp;{order.deliveryAddress}</Text>}
               </View>
               
                    {isFilled(order.orderItems)?
                    <View style={styles.checkbox}>
                        <Icon type='font-awesome' name='check' color='green' size={24}/>
                        <Text>Filled</Text> 
                    </View>

                    :
                   <View style={styles.checkbox}> 
                    <CheckBox 
                    size={24} 
                    title='Open' 
                    checkedTitle='Filled'
                    checked={checked}
                    onPress={()=> {
                        setChecked(!checked)
                        changeOrderStatus({ variables: {
                            vendor,
                            orderNo: order.orderNo,
                            status: !checked
                        }})
                    }}
                    />
                    </View>
                    }
                   
                


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
    card: {
      marginHorizontal: 5,
      marginVertical: 5,
      width: width * 0.9,
      height: height / 5,
      backgroundColor: 'white',
      borderColor: 'white',
      borderRadius: 5,
      paddingHorizontal: 20
    },
    checkbox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
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
    }
})


export default SingleOrderScreen