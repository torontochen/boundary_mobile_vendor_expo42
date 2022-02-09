import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator} from 'react-native'
import { Card, CheckBox, ListItem, Button, Slider, Icon, Overlay } from 'react-native-elements'
import {  useQuery, useMutation } from '@apollo/react-hooks'
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';


import { GET_PICKUP_ADDRESS, GET_CURRENT_RESIDENT, GET_RESIDENT_ORDERS } from '../../queries/queries_query'
import { PLACE_ORDER } from '../../queries/queries_mutation'

const { height, width } = Dimensions.get("window");


const CheckoutScreen = ({ navigation, route }) => {

    const { shoppingCart, resident } = route.params
    const vendorList = []
    vendorList.push(shoppingCart[0].vendorName)
    console.log('vendorList', vendorList)

    const [creditCardCheck, setCreditCardCheck] = useState(true)
    const [isOverlayVisible, setIsOverlayVisible] = useState(false)
    const [paypalCheck, setPaypalCheck] = useState(false)
    const [pickupCheck, setPickupCheck] = useState(true)
    const [pickupAddress, setPickupAddress] = useState()
    const [shipToCheck, setShipToCheck] = useState(false)
    const [shipToAddress, setShipToAddress] = useState()
    const [value, setValue] = useState(0)
    // const [subTotal, setSubTotal] = useState(0)
    // const [tax, setTax] = useState(0)
    console.log('shopping cart',shoppingCart)

    let tax = 0
    let subTotal = 0
    let totalRewardSilver = 0
    const tableHead = ['Description', 'vendor', 'qty', 'price', 'amount']

    const tableData = shoppingCart.map(item => {
        const rowData = []
        
            const price = item.promoRate > 0 ? item.promoRate : item.rate
            rowData.push(item.description)
            rowData.push(item.vendorName)
            rowData.push(item.quantity)
            rowData.push('$'+price.toFixed(2))
            rowData.push('$'+(price*item.quantity).toFixed(2))
            tax = tax + price * item.quantity * item.taxRate
            subTotal = subTotal + price * item.quantity
            totalRewardSilver = totalRewardSilver + item.rewardSilver * item.quantity
            return rowData
    })

    const interpolate = (start, end ) => {
        let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
        return Math.ceil((1 - k) * start + k * end) % 256;
      };

    const color = () => {
        let r = interpolate(255, 0);
        let g = interpolate(0, 255);
        let b = interpolate(0, 0);
        return `rgb(${r},${g},${b})`;
      };

    const { data, loading } = useQuery(GET_PICKUP_ADDRESS, { variables: { vendorList }})
    const { data: residentData, loading: residentLoading } = useQuery(GET_CURRENT_RESIDENT)
    const [placeOrder, { loading: placeOrderLoading}] = useMutation(PLACE_ORDER, {
        refetchQueries:[{ query: GET_RESIDENT_ORDERS, variables: { resident }}, { query: GET_CURRENT_RESIDENT }],
        awaitRefetchQueries: true
    })

    useEffect(() => {
        setIsOverlayVisible(placeOrderLoading)
    }, [placeOrderLoading])

    useEffect(() => {
        if(data) {
            console.log('pickupAddress', data.getPickupAddress)
            setPickupAddress(data.getPickupAddress)
        }
    }, [data, loading])

    useEffect(() => {
        if(residentData){
            const { mailStrAddress,
                mailCity,
                mailState,
                mailCountry,
                mailPostalCode} = residentData.getCurrentResident
            const address = mailStrAddress 
                    + ' ' + mailCity 
                    + ' ' + mailState 
                    + ' ' + mailCountry 
                    + ' ' + mailPostalCode
            setShipToAddress(address)

        }
    }, [residentData, residentLoading])

    return (
        <ScrollView>
            <Card style={styles.deliver}>
                <Card.Title style={{textAlign: 'left', marginLeft: 10, fontSize: 20}}>Deliver</Card.Title>
                <CheckBox
                    title="Pick Up"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={pickupCheck}
                    onPress={() => {setPickupCheck(!pickupCheck) 
                                    setShipToCheck(!shipToCheck)}}
                />
                {pickupCheck&&pickupAddress&&(
                   <ListItem 
                   >
                       <ListItem.Content>
                        <ListItem.Title style={{fontWeight: 'bold', fontSize: 18, marginVertical: 5}}>{pickupAddress[0].vendor}</ListItem.Title>
                        <ListItem.Subtitle>{pickupAddress[0].address}</ListItem.Subtitle>
                       </ListItem.Content>
                      
                   </ListItem>
                )}
                <CheckBox
                    title="Ship To"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={shipToCheck}
                    onPress={() => {setPickupCheck(!pickupCheck) 
                                    setShipToCheck(!shipToCheck)}}
                />
                {shipToCheck&&shipToAddress&&(
                     <ListItem 
                     >
                         <ListItem.Content>
                          <ListItem.Title style={{fontWeight: 'bold', fontSize: 18, marginVertical: 5}}>{resident}</ListItem.Title>
                          <ListItem.Subtitle>{shipToAddress}</ListItem.Subtitle>
                         </ListItem.Content>
                        
                     </ListItem>
                )}
            </Card>

            <Card >
                <Card.Title style={{textAlign: 'left', marginLeft: 10, fontSize: 20}}>Payment</Card.Title>
                <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[2, 1, 1, 1, 1]}/>
                    {/* {
                        tableData.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                            {
                            rowData.map((cellData, cellIndex) => (
                                <Cell key={cellIndex} data={cellData} textStyle={styles.text} />
                            ))
                            }
                            
                        </TableWrapper>
                        ))
                    } */}
                    <TableWrapper style={styles.row}>
                    <Rows data={tableData} flexArr={[2, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text} flexArr={[2, 1, 1, 1]} ellipsizeMode='tail' numberOfLines={1}/>
                            
                        </TableWrapper>
                </Table>
                {/* <Card.Divider style={{marginVertical: 1}}/>  */}
                <Text style={{fontSize: 10, color: 'black', textAlign: 'left', fontWeight: 'bold', marginRight:2, marginTop: 5}}> Total silver earned on this order:&nbsp;&nbsp;&nbsp;{totalRewardSilver.toString()}</Text>
                
                <Card.Divider style={{marginVertical: 5}}/> 
                <Text style={{fontSize: 10, color: 'red', textAlign: 'right', fontWeight: 'bold', marginRight: 8, marginTop: 5}}> Total before tax:&nbsp;&nbsp;&nbsp;${subTotal.toFixed(2).toString()}</Text>
                <Text style={{fontSize: 10, color: 'red', textAlign: 'right', fontWeight: 'bold', marginRight: 8, marginTop: 5}}> tax (%13):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${tax.toFixed(2).toString()}</Text>
                <Text style={{fontSize: 10, color: 'red', textAlign: 'right', fontWeight: 'bold', marginRight: 8, marginTop: 5}}> Total Amount:&nbsp;&nbsp;&nbsp;${(tax + subTotal).toFixed(2).toString()}</Text>
                <Card.Divider style={{marginVertical: 5}}/>
                <View>
                    <Text>Pay by Silver(silver 1000 = gold 1)</Text>
                </View>
                <View style={styles.silver}>
                    
                    <Icon name='coins' color='#BDBDBD' size={16} type='font-awesome-5'/>
                    <Text style={{fontSize: 10, fontWeight: 'bold'}}>&nbsp;{residentData.getCurrentResident.silverCoins-value}</Text>
                     <Slider
                    value={value}
                    onValueChange={setValue}
                    maximumValue={residentData.getCurrentResident.silverCoins}
                    minimumValue={0}
                    step={1000}
                    allowTouchTrack
                    trackStyle={{ height: 5, backgroundColor: 'transparent', width: width / 4, marginHorizontal: 10}}
                    thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                    thumbProps={{
                        children: (
                        <Icon
                            name="donate"
                            type="font-awesome-5"
                            size={14}
                            reverse
                            containerStyle={{ bottom: 20, right: 20 }}
                            color={color()}
                        />
                        ),
                    }}
                />
                    <Icon name='coins' type='font-awesome-5' color='#FDD835' size={16}/>
                    <Text style={{fontSize: 10, fontWeight: 'bold'}}>&nbsp;{Math.round(value / 1000)}</Text>
                </View>
                <Card.Divider style={{marginVertical: 5}}/> 
                <Text style={{fontSize: 18, color: 'red', textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Balance:&nbsp;&nbsp;&nbsp;${tax + subTotal - Math.round(value / 1000)>0?(tax + subTotal - Math.round(value / 1000)).toFixed(2).toString():0}</Text>
                <Card.Divider style={{marginVertical: 5}}/> 
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                       <CheckBox
                        title={(
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Icon 
                                name='cc-visa'
                                type='font-awesome-5'
                                size={36}
                                style={{marginHorizontal: 3}}
                                color='blue'
                            />  
                              <Icon 
                                name='cc-mastercard'
                                type='font-awesome-5'
                                size={36}
                                style={{marginHorizontal: 3}}
                                color='blue'

                            />  
                            </View>
                            )
                            
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={creditCardCheck}
                        onPress={() => {setCreditCardCheck(!creditCardCheck) 
                                        setPaypalCheck(!paypalCheck)}}
                        containerStyle={{width: width / 2.5}}                
                        /> 
                
                <CheckBox
                    title={
                        <Icon 
                        name='cc-paypal'
                        type='font-awesome-5'
                        size={36}
                        style={{marginHorizontal: 3}}
                        color='blue'

                    />  
                    }
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={paypalCheck}
                    onPress={() => {setCreditCardCheck(!creditCardCheck) 
                                    setPaypalCheck(!paypalCheck)}}
                        containerStyle={{width: width / 2.5}}                
                />
                </View>
                <Button 
                    icon={
                        <Icon
                          name="file-contract"
                          type='font-awesome-5'
                          color="#ffffff"
                          iconStyle={{ marginRight: 10 }}
                        />
                      }
                      buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginVertical: 5,
                      }}
                      title="Place Order"
                      onPress={() => {
                          placeOrder({ variables : {
                            resident, 
                            vendor: shoppingCart[0].vendorName, 
                            deliveryType: pickupCheck ? 'pickup' : 'ship', 
                            deliveryAddress: shipToAddress,
                            pickupAddress: pickupAddress[0].address, 
                            tax,
                            totalAmount: tax + subTotal,
                            silverSpand: value,
                            paymentMethod: creditCardCheck ? 'creditcard' : 'paypal'
                          }})
                      }}
                />
            </Card>
            <Overlay
                visible={isOverlayVisible}
                >
                <ActivityIndicator
                    color="#0000ff"
                    size='large'
                />
            </Overlay>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    deliver: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    head: { height: 40, backgroundColor: '#808B97' },

    text: { margin: 5, textAlign: 'left', fontSize: 11 },

    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },

    silver: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 20
    }
})


export default CheckoutScreen