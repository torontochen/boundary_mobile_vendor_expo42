import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Alert, Dimensions} from 'react-native'
import { Card, CheckBox, Button, Icon, Overlay } from 'react-native-elements'
import { useMutation } from '@apollo/react-hooks'

import { PLACE_ORDER } from '../../queries/queries_mutation'
import QrCodeScanner from '../../components/QrCodeScanner'
import themes from '../../assets/themes'

const { height, width } = Dimensions.get("window");

const CheckoutScreen = ({ navigation, route}) => {
    console.log('params', route.params)
    const { 
        vendor,
        resident,
        pickupAddress,
        totalAmount,
        totalDiscount,
        customerName,
        tax,
        salesOrderItems,
        dealsTitle} = route.params

    const [silver, setSilver] = useState(0)
    const [qrInfo, setQrInfo] = useState()
    const [creditCardCheck, setCreditCardCheck] = useState(true)
    const [paypalCheck, setPaypalCheck] = useState(false)
    const [isQrScannerVisible, setIsQrScannerVisible] = useState(false)

    const formatAmount = (value) => {
        return new Intl.NumberFormat('en-US', {  maximumFractionDigits: 3, 
          roundingIncrement: 5  }).format(value)
      }
    
      const formatCurrencyAmount = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 3, 
      roundingIncrement: 5  }).format(value)
      }


    const [placeOrder] = useMutation(PLACE_ORDER)

    useEffect(()=> {
        // console.log('qrInfo', qrInfo)
        if(qrInfo&&qrInfo.customerName == resident) {
            if (qrInfo.silver > totalAmount + tax) {
            Alert.alert('Overpaid', " ", [{ text: "OK" }])
            return
            }
           setSilver(qrInfo.silver)
        }
    }, [qrInfo])
    
    console.log('salesOrderItems',salesOrderItems)
    return (
        <>
            <Card>
                <Card.Title style={{textAlign: 'left', color: themes.accent}}>Total Amount:&nbsp;{formatCurrencyAmount(totalAmount+tax-totalDiscount)}</Card.Title>
                <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 5}}>
                    <Button
                        containerStyle={{
                        width: 180,
                        marginLeft: -10
                        }}
                        title="Pay With Boundary Silver"
                        type="clear"
                        titleStyle={{ color: 'rgba(78, 116, 289, 1)', fontSize: 12, textAlign: 'right' }}
                        onPress={()=>{
                           
                            setIsQrScannerVisible(!isQrScannerVisible)
                        }}
                    />
                    {silver>0&&<Text style={{textAlign: 'left', color: themes.accent}}>
                        -{formatAmount(silver)}
                    </Text> }
                    
                </View>
                
                <Card.Divider />
                <Card.Title style={{textAlign: 'left', fontFamily: 'mr800', fontSize: 18, color: themes.secondary}}>Balance:&nbsp;{formatCurrencyAmount(totalAmount+tax-totalDiscount-silver)}</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                       <CheckBox
                        title={(
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Icon 
                                name='cc-visa'
                                type='font-awesome-5'
                                size={36}
                                style={{marginHorizontal: 3}}
                                color={themes.primary}
                            />  
                              <Icon 
                                name='cc-mastercard'
                                type='font-awesome-5'
                                size={36}
                                style={{marginHorizontal: 3}}
                                color={themes.primary}

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
                        color={themes.primary}

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
                        backgroundColor: themes.primary
                      }}

                      title="Place Order"
                      onPress={() => {
                       
                          placeOrder({ variables : {
                            resident, 
                            vendor, 
                            deliveryType:'pickup', 
                            customerName,
                            deliveryAddress: '',
                            pickupAddress, 
                            tax,
                            totalAmount,
                            totalDiscount,
                            silverSpand: silver,
                            paymentMethod: creditCardCheck ? 'creditcard' : 'paypal',
                            dealsTitle,
                            salesOrderItems,
                            valueDiscountList: []
                          }})
                      }}
                />
            </Card>

               {/* Qr Scanner Overlay  */}
               <Overlay
                visible={isQrScannerVisible}
                fullScreen
            >
                <QrCodeScanner 
                    setQrInfo={setQrInfo}
                    setIsQrScannerVisible={setIsQrScannerVisible}
                    isQrScannerVisible={isQrScannerVisible}
                />
            </Overlay>
        </>
    )
}

export default CheckoutScreen