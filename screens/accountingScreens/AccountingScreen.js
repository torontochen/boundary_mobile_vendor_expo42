import React, { useState  } from 'react'
import { View, Text,  Dimensions,  StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity}  from 'react-native'
import { Icon, Overlay, Image, Card, Slider, Button, CheckBox } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'


import {GET_VENDOR_SETTLEMENT_RECORDS} from "../../queries/queries_query"
import themes from '../../assets/themes'

const { height, width } = Dimensions.get("window");



const AccountingScreen = ({route}) => {
    const { vendor } = route.params

   const silverPurchaseList = ['5000', '10000', '20000', '50000', '100000', '200000', '500000', '1000000', '10000000']

    const { data: settlementData, loading } = useQuery(GET_VENDOR_SETTLEMENT_RECORDS, { variables: { vendor: vendor.businessTitle }})

    const [creditCardCheck, setCreditCardCheck] = useState(true)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isExchangeGoldOpen, setIsExchangeGoldOpen] = useState(false)
    const [isPurchaseSliverOpen, setIsPurchaseSliverOpen] = useState(false)
    const [gold, setGold] = useState(vendor.goldCoins)
    const [goldToExchange, setGoldToExchange] = useState(0)
    const [paypalCheck, setPaypalCheck] = useState(false)
    const [silverToPurchase, setSilverToPurchase] = useState(0)
    const [silver, setSilver] = useState(vendor.silverCoins)

    const toggleOverlay = () => {
        setIsDetailsOpen(false)
        setIsExchangeGoldOpen(false)
        setIsPurchaseSliverOpen(false)
    };

   const  settlement = (records) => {
        let funds = 0
        let customerPaid = 0
        let boundaryCharge = 0
        for(let record of records){
            funds += (record.amountPaidByCustomer - record.boundaryPayable)
            customerPaid += record.amountPaidByCustomer 
            boundaryCharge += record.boundaryPayable
        }
        return {funds, customerPaid, boundaryCharge }
    }


    const formatAmount = (value) => {
        return new Intl.NumberFormat('en-US', {  maximumFractionDigits: 2, 
          roundingIncrement: 5  }).format(value)
      }
    
    const formatCurrencyAmount = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, 
    roundingIncrement: 5  }).format(value)
    }

    //TODO Settlement Record Details
  const renderItems = ({ item, i }) => {
    
    return (
        <Card containerStyle={styles.card}>
          <View style={styles.orderNoContainer}>
            <Card.Title style={{textAlign: 'left', marginVertical: 10,  color: themes.accent}}>{item.salesOrderNo}</Card.Title>
            <Text>Date:&nbsp;{moment(new Number(item.date)).format('YYYY-MM-DD')}</Text>
          </View>
               {/* customer */}
               <View style={styles.customer}>
                  <Text>Customer Paid:&nbsp;{formatCurrencyAmount(item.amountPaidByCustomer)}</Text>
                </View>
              {/* amount */}
               <View style={styles.content}>
                 <Text>Boundary Charge:&nbsp;{formatCurrencyAmount(item.boundaryPayable)}</Text>
                 <Text>$ Held:&nbsp;{formatCurrencyAmount(item.amountPaidByCustomer - item.boundaryPayable)}</Text>
               </View>
              {/* date */}
               <View style={styles.content}>
                   <Text>Gold Collected:&nbsp;{formatAmount(item.boundaryGold)}</Text>
               </View>
        </Card>
    
  )};

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
            {settlementData?
            (
                <TouchableOpacity onLongPress={()=> {setIsDetailsOpen(true)}}>
                     <View style={{
                        width: width * 0.95, 
                        height: height * 0.80, 
                        backgroundColor: themes.primary,
                        marginVertical: 8,
                        borderRadius: 16,
                        shadowColor: themes.shade,
                        shadowRadius: 10,
                        shadowOffset: { width: 5, height: 3 },
                        shadowOpacity: 0.2,
                        padding: 2,
                        flexDirection:'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'}} >
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left'}}>Customer Paid:&nbsp;
                            {formatCurrencyAmount(settlement(settlementData.getVendorSettlementRecords).customerPaid)}</Text>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left'}}>Boundary Charge:&nbsp;
                            {formatCurrencyAmount(settlement(settlementData.getVendorSettlementRecords).boundaryCharge)}</Text>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left'}}>Funds Held by Boundary:&nbsp;
                            {formatCurrencyAmount(settlement(settlementData.getVendorSettlementRecords).funds)}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Icon name="coins" type="font-awesome-5" size={25} color="yellow"></Icon>
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left', marginHorizontal: 10}}>Boundary Gold:&nbsp;{formatAmount(gold)}</Text>
                                <Icon name="exchange" type="font-awesome" size={25} color="white" disabled={gold==0} onPress={()=>{setIsExchangeGoldOpen(true)}}></Icon>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Icon name="coins" type="font-awesome-5" size={25} color="white"></Icon>
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left', marginHorizontal: 10}}>Boundary Silver:&nbsp;{formatAmount(silver)}</Text>
                                <Icon name="money" type="font-awesome" size={25} color="white" onPress={()=>setIsPurchaseSliverOpen(true)}></Icon>
                            </View>
                        </View>
                </TouchableOpacity>
           )
           :(
            <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Icon 
                name='calculator-sharp'
                type='ionicon'
                size={80}
                color={themes.shade4}
            />
            <Text style={{ fontFamily: 'mr900', fontSize: 22, color: themes.shade4, fontWeight: 'bold'}}>No Recordss</Text>
       </View>
           )}
           
           {/* Details Overlay */}
           <Overlay
            isVisible={isDetailsOpen}
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.77}}
            >
                {settlementData.getVendorSettlementRecords.length>0&&
                <FlatList 
                    data={settlementData.getVendorSettlementRecords}
                    renderItem={renderItems}
                    keyExtractor={item => item.salesOrderNo} 
                    refreshing={true}
                    showsVerticalScrollIndicator={false}
                /> 
          }
          </Overlay>   

          {/* Exchange Gold */}
          <Overlay 
            isVisible={isExchangeGoldOpen} 
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.25}}
            >
                {gold&&(
                    <Card>
                        <Card.Title>1 Boundary Gold = $1</Card.Title>

                        <View style={styles.silver}>
                            <Icon name='coins' color='#FF9800' size={16} type='font-awesome-5'/>
                            <Text style={{fontSize: 12, color: '#FF9800',fontWeight: 'bold', marginRight: 5}}>
                                &nbsp;{formatAmount(gold - goldToExchange)}</Text>
                            <Slider
                            value={goldToExchange}
                            onValueChange={setGoldToExchange}
                            maximumValue={gold}
                            minimumValue={0}
                            step={50}
                            allowTouchTrack
                            trackStyle={{ height: 5, backgroundColor: 'transparent', width: width / 5, marginHorizontal: 15}}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                            thumbProps={{
                                children: (
                                <Icon
                                    name="donate"
                                    type="font-awesome-5"
                                    size={14}
                                    reverse
                                    containerStyle={{ bottom: 20, right: 20 }}
                                    color={themes.primary}
                                />
                                ),
                            }}
                        />
                            <Icon name='money-bill' type='font-awesome-5' color={themes.secondary} size={16}/>
                            <Text style={{fontSize: 12, color: themes.secondary, fontWeight: 'bold'}}>&nbsp;{formatCurrencyAmount(Math.round(goldToExchange))}</Text>
                    </View>  
                    <Button 
                        title='Confirm' 
                        disabled={goldToExchange==0}
                        onPress={()=>{
                            setGold(gold - goldToExchange)
                            setIsExchangeGoldOpen(false)
                        }} 
                        containerStyle={styles.button}
                        buttonStyle={{backgroundColor: themes.primary}}

                        />
                    </Card>
                )}
        
          </Overlay>

          {/* Purchase Silver */}
          <Overlay 
            isVisible={isPurchaseSliverOpen} 
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.4}}
            >
                {gold&&(
                    <Card>
                        <Card.Title>$1 = 1,000 Boundary Silver</Card.Title>
                        <View style={styles.silver}>
                            <Icon name='coins' color='#757575' size={16} type='font-awesome-5'/>
                            <ModalDropdown 
                            options={silverPurchaseList} 
                            defaultValue={silverToPurchase.toString()}
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropdownTextStyle={styles.dropdownItems}
                            onSelect={(index, value) => {
                             setSilverToPurchase(parseInt(value))
                            }}
                          /><View style={{width: 10}}
                          ></View>
                            <Icon name='money-bill' type='font-awesome-5' color={themes.secondary} size={15}/>
                            <Text style={{fontSize: 14, color: themes.secondary,fontWeight: 'bold', marginLeft: 3}}>Amount&nbsp;{formatCurrencyAmount(Math.round(silverToPurchase / 1000))}</Text>
                    </View>  
                    <View style={styles.payment}>
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
                        title='Confirm' 
                        onPress={()=>{
                            setSilver(silver + silverToPurchase)
                            setIsPurchaseSliverOpen(false)
                        }} 
                        containerStyle={styles.button}
                        buttonStyle={{backgroundColor: themes.primary}}
                        />
                    </Card>
                )}
        
          </Overlay>

              {/*  fetching overlay */}
              <Overlay
               visible={loading}
               fullScreen
               >
                    <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    
                        <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' />

                    </View>
          
               </Overlay>
        </View>
    )
}

const styles = StyleSheet.create({

    button: {
        width: '100%', 
        margin: 'auto',
        backgroundColor: themes.primary
      },
 
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

    content: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 10,
    },

    customer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10
    },

    dropdown: {
        width: 100,
        height: 30,
        borderWidth: 1,
        borderColor: themes.shade3,
        borderRadius: 10,
        padding: 2,
        backgroundColor: themes.shade3,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center'
      },
    
      dropdownItems: {
        fontSize: 14,
        color: themes.primary
      },
    
      dropdownText: {
        fontFamily: 'mr400',
        fontSize: 15,
        fontWeight: 'bold',
        color: themes.primary
      },

    orderNoContainer: {
      width: '100%',
      backgroundColor: themes.shade4,
      marginTop: -15,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
     marginRight: 10
    },

    payment: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    },


    silver: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 10
    },
})

export default AccountingScreen