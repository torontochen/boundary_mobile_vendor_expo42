import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { Overlay, Card, ListItem, Image } from 'react-native-elements'
import { useSubscription, useLazyQuery, useQuery } from '@apollo/react-hooks'
// import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import moment from 'moment'
import _ from 'lodash'

import { RESIDENT_ORDER_ADDED } from '../../queries/queries_subscription'
import { GET_CURRENT_RESIDENT } from '../../queries/queries_query'

const { height, width } = Dimensions.get("window");
const cardGap = 10;
const cardWidth = (width - cardGap * 5) / 2;
const cardHeight = height / 2.4

const OrderScreen = ({route}) => {

    const { order } = route.params
    console.log('order', order)

    const [isDetailsOverlayOpen, setIsDetailsOverlayOpen] = useState(false)
    const [itemList, setItemList] = useState()
    const [silverSpand, setSilverSpand] = useState(0)
    const [residentOrders,setResidentOrders] = useState(order)
    // const [residentData, setResidentData] = useState()
    // const [tableData, setTableData] = useState()

    // const tableHead = ['Description', 'vendor', 'qty', 'price', 'amount']

    // const [getCurrentResident] = useLazyQuery(GET_CURRENT_RESIDENT, {
    //   async onCompleted ({ getCurrentResident }) {
    //       console.log('getCurrentResident', getCurrentResident)
    //     setResidentData(getCurrentResident)
    //   }
    // })
    const { data: residentData } = useQuery(GET_CURRENT_RESIDENT) 

    useSubscription(RESIDENT_ORDER_ADDED, {
        onSubscriptionData({subscriptionData}) {
           const { data: { residentOrderAdded }} = subscriptionData
           console.log(residentOrderAdded)
           const newOrders = [...residentOrders]
            newOrders.push(residentOrderAdded)
            setResidentOrders(newOrders)
        }
      })

    //   useEffect(() => {
    //       if(residentOrders.length>0) {
    //           getCurrentResident()
    //       }
    //   }, [residentOrders])
      
    const toggleOverlay = () => {
        setIsDetailsOverlayOpen(!isDetailsOverlayOpen)
      };

    const showOrderDetails = (i) => {
        setSilverSpand(0);

        console.log('item', i)
        setItemList(residentOrders[i]);
        const itemChose = residentOrders[i]
        const index = _.findIndex(residentData.getCurrentResident.silverRecords, (record) => {
          return record.orderNo == itemChose.orderNo;
        });
        if (index > 0) {
          setSilverSpand(residentData.getCurrentResident.silverRecords[index].amountSpand);
        }
        setIsDetailsOverlayOpen(true)
      }

    return (
        <View>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            { residentOrders.length>0&&residentOrders.map((item,i) => {
                return (
                    <TouchableOpacity
                    key={i}
                    onPress={()=> {
                        showOrderDetails(i)
                    }}
                    >
                        <Card containerStyle={{
                                shadowColor: "#212121",
                                shadowRadius: 2,
                                shadowOffset: { width: 0, height: 2 },
                                marginTop: cardGap,
                                marginLeft: i % 2 !== 0 ? cardGap : 10,
                                width: cardWidth,
                                height: cardHeight,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                shadowOpacity: 0.2,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5
                            }}>
                        <Card.Image
                        source={{ uri: item.orderItem[0].photo}}
                        resizeMode='contain'
                        style={{marginBottom: 5}}
                        >
                        </Card.Image>
                            <Card.Title style={styles.title} ellipsizeMode='middle' numberOfLines={1}>No:&nbsp;{item.orderNo}</Card.Title>
                        <Card.Divider style={{marginBottom: 5}}/>
                            <Text style={styles.text}>Sold by:&nbsp;{item.vendor}</Text>
                        <Card.Divider style={{marginVertical: 5}}/>
                            <Text style={styles.text}>{item.deliveryType=='pickup'?'Pick Up at:':'Ship To'}</Text>
                            <Text style={styles.text}>{item.deliveryType=='pickup'?item.pickupAddress:item.deliveryAddress}</Text>
                        <Card.Divider style={{marginVertical: 5}}/>

                            <Text style={{fontSize: 10, textAlign: 'center'}}>{moment(new Number(item.date)).format("YYYY-MM-DD")}</Text>
                        </Card>
                    </TouchableOpacity>
                )
            })}
            </ScrollView>

           {itemList&&residentData&&( <Overlay
                isVisible={isDetailsOverlayOpen}
                onBackdropPress={toggleOverlay}
                overlayStyle={{width: width * 0.95, height: height * 0.8}}
                >
                    <ScrollView>
                        <Card containerStyle={{width: width * 0.83}}>
                        <Card.Title>{itemList.orderNo}</Card.Title>
                        <Card.Divider  style={{marginVertical: 5}}/>
                        
                          {itemList.orderItem.map((item,i) => {
                                return (
                                     <ListItem key={i} style={styles.listItem}>
                                         <Image 
                                            source={{ uri: item.photo}}
                                            resizeMode='contain'
                                            containerStyle={{height: 40, width: 40}}
                                         />
                                        <ListItem.Content style={{flex: 2}}>
                                            <ListItem.Title style={styles.text} ellipsizeMode="middle" numberOfLines={2}>{item.description}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.Content style={{flex: 2}}>
                                            <ListItem.Title style={styles.text}>${item.unitPrice.toFixed(2).toString()}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.Content style={{flex: 0}}>
                                            <ListItem.Title style={styles.text}>{item.quantity}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.Content style={{flex: 2}}>
                                            <ListItem.Title style={styles.text }>${(item.quantity*item.unitPrice).toFixed(2).toString()}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                )
                            })
                        }
                       
                        <Card.Divider  style={{marginVertical: 5}}/>
                        <Text style={styles.subtitle}>Subtotal:&nbsp;${(itemList.totalAmount-itemList.tax).toFixed(2).toString()}</Text>
                        <Text style={styles.subtitle}>Tax:&nbsp;${itemList.tax.toFixed(2).toString()}</Text>
                        <Text style={styles.subtitle}>Total:&nbsp;${itemList.totalAmount.toFixed(2).toString()}</Text>
                        <Text style={styles.title}>Payment</Text>
                       <Text style={styles.subtitle}>Boundary Silver:&nbsp;{silverSpand}</Text>
                       <Text style={styles.subtitle}>Paid ${(itemList.totalAmount-Math.round(silverSpand / 1000)).toFixed(2).toString()}&nbsp;by&nbsp;{itemList.paymentMethod}</Text>
                    </Card> 
                     </ScrollView>
                  
            </Overlay>  )}
        </View>)
   
        
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 5
    },
    text: {fontSize: 10},
    title: {
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'left', 
        color: 'white', 
        backgroundColor: '#BDBDBD', 
        padding: 3, 
        marginLeft: -5,
        borderRadius: 5, 
        borderColor: 'white', 
        borderWidth: 1, 
        overflow: 'hidden'
    }
})

export default OrderScreen