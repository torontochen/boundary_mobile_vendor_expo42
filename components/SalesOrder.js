import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Alert} from 'react-native'
import { Card, Icon, ListItem, Overlay, SpeedDial, Input , Button, FAB, Image} from 'react-native-elements'
import {useMutation, useQuery, useLazyQuery} from '@apollo/react-hooks'
import moment from 'moment'
import { Picker } from "@react-native-community/picker";


import themes from '../assets/themes';
import QrCodeScanner from './QrCodeScanner'
import { GET_SINGLE_COUPON , GET_PICKUP_ADDRESS, SEARCH_AVAILABLE_DEALS} from '../queries/queries_query'

const { height, width } = Dimensions.get("window");


const SalesOrder = (props) => {
    const { catalog, vendor, navigation } = props
    // console.log('catalog', catalog)
    // console.log('vendor', vendor)
    let totalDiscountData = 0

    const [qrInfo, setQrInfo] = useState()
    const [visible, setVisible] = useState(false)
    const [isQrScannerVisible, setIsQrScannerVisible] = useState(false)
    const [isInputOverlayVisible, setIsInputOverlayVisible] = useState(false)
    const [customerName, setCustomerName] = useState()
    const [customerFullName, setCustomerFullName] = useState()
    const [flyerId, setFlyerId] = useState()
    const [couponId, setCouponId] = useState()
    const [couponTitle, setCouponTitle] = useState()
    const [flyerTitle, setFlyerTitle] = useState()
    const [amount, setAmount] = useState(0)
    const [itemList, setItemList] = useState([])
    const [itemPicked, setItemPicked] = useState()
    const [indexInEdit, setIndexInEdit] = useState()
    const [quantity, setQuantity] = useState()
    const [pickupAddress, setPickupAddress] = useState()
    const [orderNo, setOrderNo] = useState()
    const [soughtDeals, setSoughtDeals] = useState()
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [dealsSoughtTitle, setDealsSoughtTitle] = useState([])
    


    // const toggleOverlay = () => {
    //     setIsQrScannerVisible(!isQrScannerVisible)
    //   };
    const catalogList = (item) => {
            return `(${item.itemCode})${item.description}`
    }

    
    const formatCurrencyAmount = (value) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        maximumFractionDigits: 2, 
        minimumFractionDigits: 2,
    // roundingIncrement: 5  
        }).format(value)
    }

    // const getOrderNo = (vendorName) => {
    //     const newTitle = vendorName.replace(/\s/g, "")
    //     const no = newTitle + '_' + Date.now().toString()
    //     // setOrderNo(no)
    //     return no
    // }

    // const subTotal = (list) => {
    //     console.log('list', list)
    //     let subTotal
    //         for (let item of list) {
    //             subTotal = subTotal + item.quantity * item.unitPrice
    //         }
    //         console.log('subTotal', subTotal)
    //         return subTotal
    // }

    
    useEffect(()=>{
        if(itemList) {
            let subTotal = 0
            for (let item of itemList) {
                subTotal = subTotal + Number(item.quantity) * (item.dealPrice > 0 ? item.dealPrice : item.unitPrice)
            }
            console.log('subTotal', subTotal)
            setAmount(subTotal)
        }
    },[itemList])


    useEffect(()=>{
        if(!soughtDeals) return
        
        if(soughtDeals.length == 0) {
            Alert.alert('No Available Deals', " ", [{ text: "OK" }])
        } else {
            const listItem = [...itemList]
            console.log('listItem', listItem)
            for (let item of soughtDeals) {
                const index = itemList.findIndex(listItem => listItem.itemCode == item.itemCode )
                // console.log(index)
                switch(item.valueType) {
                    case 'CASH_VALUE':
                        // const listItem1 = [...itemList]
                        console.log('listItem1',listItem)
                        listItem[index].dealPrice = item.amount
                        
                        // this.$set(this.shoppingCart, index, listItem1)
                        // setItemList(listItem)
                        const titleList1 = [...dealsSoughtTitle]
                        titleList1.push({title: item.flyerTitle, flyerId: item.flyerId})
                        setDealsSoughtTitle(titleList1)
                        // setTotalDiscount(totalDiscount + )
                        console.log((listItem[index].unitPrice - listItem[index].dealPrice) * itemList[index].quantity)
                        totalDiscountData = totalDiscountData + (listItem[index].unitPrice - listItem[index].dealPrice) * itemList[index].quantity
                        // console.log('CASH_VALUE', listItem[index].discount)
                        break;
                    case 'CASH_DISCOUNT':
                        // this.$nextTick(()=> {
                        // const listItem = [...itemList]
                        console.log(listItem)
                        console.log('listItem[index].discount',listItem[index].discount)
                        // const discount = listItem[index].discount
                        // console.log(discount + itemList[index].quantity * item.amount)
                        // this.shoppingCartList.splice(index, 1, listItem)
                        console.log(listItem[index].discount)
                        console.log(listItem)
                        // setItemList(listItem)
                        const titleList = [...dealsSoughtTitle]
                        titleList.push({title: item.flyerTitle, flyerId: item.flyerId})
                        setDealsSoughtTitle(titleList)
                        // setTotalDiscount(totalDiscount + )
                        console.log(itemList[index].quantity * item.amount)
                        totalDiscountData = totalDiscountData + itemList[index].quantity * item.amount
                        // console.log('CASH_DISCOUNT', listItem[index].discount)
                        // this.shoppingCartList[index].discount = this.shoppingCartList[index].quantity * item.amount
                        // })
                       
                        break;
                    case 'PERCENTAGE_DISCOUNT':
                        if(item.isForAllItems) {
                            totalDiscountData = totalDiscountData + amount * item.amount
                            // setTotalDiscount()
                        } else {
                            // const listItem2 = [...itemList]
                            console.log('listitem2',listItem)
                            
                            // setItemList(listItem)
                           
                            totalDiscountData = totalDiscountData + itemList[index].quantity * itemList[index].unitPrice * item.amount
                        }
                        const titleList2 = [...dealsSoughtTitle]
                        titleList2.push({title: item.flyerTitle, flyerId: item.flyerId})
                        setDealsSoughtTitle(titleList2)
                        break;
                    // case 'COMBO_CASH_VALUE':
                    //     this.comboTotalAmount = item.amount
                    //     this.totalDiscount = item.amount - this.totalBeforeTax
                    //     this.dealsSoughtTitle.push(item.flyerTitle)
                    //     break;
                }
            }
            console.log('totalDiscountData', totalDiscountData)
            setTotalDiscount(totalDiscountData)
            setItemList(listItem)
        }
    },[soughtDeals])

    useQuery(GET_PICKUP_ADDRESS, {
        variables: { vendorName: vendor.businessTitle},
       async onCompleted({getPickupAddress}) {
           setPickupAddress(getPickupAddress.address)
       }
    })

    const [searchAvailableDeals, {loading: dealLoading}] = useLazyQuery(SEARCH_AVAILABLE_DEALS, {
        async onCompleted({searchAvailableDeals}) {
            console.log('seachvailableDeals', searchAvailableDeals)
            setSoughtDeals(searchAvailableDeals)
        }
    })

    const [getSingleCoupon, {loading: couponLoading}] = useLazyQuery(GET_SINGLE_COUPON, {
      async onCompleted({getSingleCoupon}) {
          console.log('getSingleCoupon', getSingleCoupon)
          const {amount, itemsBound} = getSingleCoupon
             setAmount(amount)
            setItemList(itemsBound)
        }
    })

    // const itemPickedValue = () => {
    //     if(indexInEdit) {
    //         return itemList[indexInEdit].itemCode
    //     } else {return itemPicked}
    // }

    useEffect(()=>{
        console.log('itemList', itemList)
        console.log('indexInEdit', indexInEdit)
        if(indexInEdit)
        console.log('indexinedititem',itemList[indexInEdit].description)
    }, [itemList, indexInEdit])

    useEffect(()=> {
        // console.log('qrInfo', qrInfo)
        if(qrInfo&&qrInfo.valueType == 'COMBO_CASH_VALUE') {
            setCustomerName(qrInfo.customerName)
            setCustomerFullName(qrInfo.customerFullName)
            setFlyerId(qrInfo.flyerId)
            setCouponId(qrInfo.couponId)
            setCouponTitle(qrInfo.couponTitle)
            setFlyerTitle(qrInfo.flyerTitle)
            getSingleCoupon({ variables: {vendor: vendor.businessTitle, flyerId: qrInfo.flyerId, couponId: qrInfo.couponId}})
           
        } else if(qrInfo){
            setCustomerName(qrInfo.customerName)
            setCustomerFullName(qrInfo.customerFullName)

        }
        const newTitle = vendor.businessTitle.replace(/\s/g, "")
        const no = newTitle + '_' + Date.now().toString()
        setOrderNo(no)
    }, [qrInfo])
    
    return (
        <>
            <Card>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Card.Title style={{textAlign: 'left', fontSize: 14, color: themes.accent}}>Order No:&nbsp;{orderNo}</Card.Title>
                    {itemList.length>0&&
                    <Button
                        containerStyle={{
                        width: 90,
                        marginBottom: 20,
                        marginRight: -5
                        }}
                        title="Check Out"
                        type="clear"
                        titleStyle={{ color: themes.primary, fontSize: 12, textAlign: 'right' }}
                        onPress={()=>{
                            navigation.navigate('Checkout', {
                                vendor: vendor.businessTitle,
                                resident: customerName,
                                customerName: customerFullName,
                                pickupAddress,
                                totalAmount: (amount-totalDiscount)*1.13,
                                totalDiscount,
                                tax: (amount-totalDiscount) * 0.13,
                                salesOrderItems: itemList,
                                dealsTitle: dealsSoughtTitle 
                            })
                            
                        }}
                    />}
                    
                </View>
                
                <Card.Divider />
                {/* customer */}
                <View style={styles.customer}>
                  <Text style={{marginRight: 10}}>Customer:&nbsp;{customerFullName}</Text>
                  {/* <TouchableWithoutFeedback>
                  <Icon type='material' name='message' color={themes.primary} size={20}/>
                  </TouchableWithoutFeedback> */}
                  {qrInfo&&qrInfo.valueType!='COMBO_CASH_VALUE'&&
                <FAB
                visible={qrInfo.valueType!='COMBO_CASH_VALUE'}
                icon={{ name: 'add', color: 'white' }}
                color={themes.accent}
                size='small'
                onPress={()=> {
                    setIsInputOverlayVisible(!isInputOverlayVisible)
                    setItemPicked(null)
                    setQuantity(null)
                }}
              />}
                </View>
                
                <Card.Divider />
              {/* items */}
               <View style={styles.content}>
                 {/* <Text>Items:&nbsp;{itemList.length.toString()}</Text>  */}
                 <Text>Date:&nbsp;{moment(Date.now()).format('YYYY-MM-DD HH:mm')}</Text>
                 </View>
                <Card.Divider /> 
                {itemList&&<ScrollView style={{height: height * 0.20 }} 
                                    >
                                    {itemList.map((item,i) => {
                                        if (item.quantity > 0) 
                                        return (
                                    <ListItem key={item.itemCode} containerStyle={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'nowrap'}}>
                                        {/* <ListItem.Content>
                                            <ListItem.Subtitle style={styles.listItem}>{item.itemCode}</ListItem.Subtitle>
                                        </ListItem.Content> */}
                                        <ListItem.Content>
                                            <ListItem.Subtitle  style={styles.listItem,{width: width * 0.2, textAlign: 'left' }} numberOfLines={1} ellipsizeMode='tail'>{item.description}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Content  right>
                                            <ListItem.Subtitle style={styles.listItem,{width: width * 0.05 }}>{item.quantity.toString()}</ListItem.Subtitle>
                                        </ListItem.Content >
                                        {item.unitPrice&&<ListItem.Content>
                                            <ListItem.Subtitle style={styles.listItem, {width: width * 0.2}}>{formatCurrencyAmount(item.unitPrice)}</ListItem.Subtitle>
                                        </ListItem.Content>}
                                        {item.unitPrice&&<ListItem.Content>
                                            <ListItem.Subtitle style={styles.listItem, {width: width * 0.2}}>{formatCurrencyAmount(item.quantity*item.unitPrice)}</ListItem.Subtitle>
                                        </ListItem.Content>}
                                        {itemList.length>0&&qrInfo.valueType!='COMBO_CASH_VALUE'&&
                                            <ListItem.Content style={{width: '10%'}} right>
                                                <Icon 
                                                name='pen' 
                                                type='font-awesome-5' 
                                                color='blue' 
                                                size={14}
                                                onPress={()=> {
                                                    setIndexInEdit()
                                                    setIsInputOverlayVisible(!isInputOverlayVisible)
                                                    setIndexInEdit(i)
                                                }}
                                                />
                                            </ListItem.Content>
                                        }
                                    </ListItem>
                                    )
                                    })}
                                </ScrollView>}
                <Card.Divider />
                <View style={styles.amount}>
                    {itemList.length>0&&
                    <Button
                    containerStyle={{
                    width: 110,
                    marginRight: -10
                    }}
                    loading={dealLoading}
                    loadingProps={{
                    size: 'small',
                    color: 'rgba(111, 202, 186, 1)',
                    }}
                    title="Search Deals"
                    type="clear"
                    titleStyle={{ color: 'rgba(78, 116, 289, 1)', fontSize: 14, textAlign: 'right' }}
                    onPress={()=>{
                        const orderItems = itemList.map(item => {
                            return {
                                itemCode: item.itemCode,
                                quantity: Number(item.quantity),
                                itemTotal: item.unitPrice * item.quantity
                            }
                        })
                        const input = {
                            orderItems,
                            resident: customerName,
                            vendor: vendor.businessTitle,
                            time: Date.now().toString()
                        }
                        searchAvailableDeals({ variables: { input }})
                    }}
                />}
                
                </View>
                {totalDiscount>0&&
                <View style={styles.amount}>
                  <Text style={{color: 'red'}}>Discount:&nbsp;-{formatCurrencyAmount(totalDiscount)}</Text>
                </View>}
               <View style={styles.amount}>
                  <Text>Subtotal:&nbsp;{formatCurrencyAmount(amount-totalDiscount)}</Text>
               </View>
               <View style={styles.amount}>
                   <Text>Tax:&nbsp;{formatCurrencyAmount((amount-totalDiscount)*0.13)}</Text>
               </View>
               <View style={styles.amount}>
                   <Text style={styles.totalText}>Total:&nbsp;{formatCurrencyAmount((amount-totalDiscount)*1.13)}</Text>
               </View>
               <Card.Divider />
               <View style={styles.date}>
                  {pickupAddress&&<Text style={{marginVertical: 5, fontSize: 13}}>Pick Up at:&nbsp;&nbsp;{pickupAddress}</Text>} 
               </View>
            </Card>


             <SpeedDial
                isOpen={visible}
                icon={{ name: 'menu-open', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setVisible(!visible)}
                onClose={() => setVisible(!visible)}
                buttonStyle={{backgroundColor: themes.primary}}
            >
                <SpeedDial.Action
                    icon={{ name: 'plus', color: '#fff', type: 'antdesign' }}
                    title="Create Sales Order"
                    onPress={() =>{
                        setVisible(!visible)
                        setIsQrScannerVisible(!isQrScannerVisible)
                        // navigation.navigate('QrCodeScanner')
                    }}
                    disabled={qrInfo}
                    buttonStyle={{backgroundColor: themes.primary}}

                />
                <SpeedDial.Action
                    icon={{ name: 'delete-outline', color: '#fff' }}
                    title="Clear Order"
                    buttonStyle={{backgroundColor: themes.primary}}
                    onPress={() => 
                    {   setQrInfo()
                        setItemList([])
                        setCustomerName()
                        setCustomerFullName()
                        setVisible(!visible)
                        setTotalDiscount(0)
                        setDealsSoughtTitle([])
                        setOrderNo()
                    }}
                    disabled={!qrInfo}
                    
                />
            </SpeedDial>

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

            {/* item Input */}
            <Overlay
                visible={isInputOverlayVisible}
                fullScreen
            >
                <Card wrapperStyle={styles.input} containerStyle={{marginTop: 50}}>
                <Picker
                    selectedValue={itemPicked}
                    placeHolder='Order Qty'
                    style={{
                        height: '60%',
                        width: '80%',
                        backgroundColor: "white",
                    }}
                    itemStyle={{fontSize: 16,  color:'black', fontWeight: 'bold', flexDirection: 'row'}}
                    onValueChange={(itemValue, itemIndex) => {
                        // console.log('itemValue', itemValue)
                        // console.log('resident', residentData.getCurrentResident.residentName )
                        // if(itemValue==itemPicked) return
                        // const itemPickedCopy = [...itemPicked]
                        // itemPickedCopy[index] = itemValue
                        setItemPicked(itemValue)
                        // console.log('quantity in picker',quantity);
                       
                    }}
                    >
                      {catalog.map((g, i) => {
                          if(indexInEdit>=0) {
                          return   itemList[indexInEdit].itemCode == g.itemCode ? (<Picker.Item key={i} label={catalogList(g)} value={g.itemCode} />) : <View key={i}/>
                          } else {
                              return <Picker.Item key={i} label={catalogList(g)} value={g.itemCode} />
                          }
                      })}
                </Picker>
                <Input 
                    placeholder={'Quantity'}
                    keyboardType="numeric"
                    onChangeText={value => setQuantity(value)}
                    // value={indexInEdit?itemList[indexInEdit].quantity.toString():quantity.toString()}
                />
                 <Button
                    icon={{ name: "done", type: "material", color: "white" }}
                    iconRight
                    onPress={() => {
                        console.log('itemList', itemList)
                        const index = itemList.findIndex(item => item.itemCode == itemPicked)
                        const catalogIndex = catalog.findIndex(item => item.itemCode == itemPicked)
                        const catalogItem = catalog[catalogIndex]
                        const singleItem = {
                            itemCode: catalogItem.itemCode,
                            description: catalogItem.description,
                            unit: catalogItem.unit,
                            unitPrice: catalogItem.promoRate > 0 ? catalogItem.promoRate : catalogItem.rate,
                            rewardSilver: catalogItem.rewardSilver,
                            quantity: Number(quantity),
                            vendor: vendor.businessTitle,
                            dealPrice: 0,
                            taxRate: catalogItem.taxRate,
                            discount: 0
                            }
                        if(index < 0) {
                            const itemListCopy = [...itemList]
                            itemListCopy.push(singleItem)
                            setItemList(itemListCopy)
                        } else {
                            const itemListCopy = [...itemList]
                            if(quantity == 0) {
                                itemListCopy.splice(index, 1)
                            setItemList(itemListCopy)
                            } else {
                                itemListCopy[index].quantity =Number(quantity)
                            setItemList(itemListCopy)
                            }
                        }
                        setIsInputOverlayVisible(!isInputOverlayVisible)
                        setIndexInEdit()

                    }}
                    title="OK"
                    disabled={!itemPicked||!quantity}
                    disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                    buttonStyle={{
                    backgroundColor: themes.primary,
                    marginHorizontal: 10,
                    }}
                    containerStyle={{width: '60%'}}
                />
                <Button 
                    title='Cancel'
                    buttonStyle={{
                        backgroundColor: themes.primary,
                        marginHorizontal: 10,
                        
                        }}
                    icon={{ name: "cancel", type: "material-community", color: "white" }}
                    iconRight
                    onPress={()=> {
                        setIsInputOverlayVisible(!isInputOverlayVisible)
                        setIndexInEdit()
                    }}
                    containerStyle={{width: '60%'}}
                />
                </Card>

            </Overlay>

            {/* loading single coupon */}
            <Overlay
                visible={couponLoading}
                fullScreen
                >
               {/* <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            
            <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' />

            </View> */}

                <ActivityIndicator
                    color="#0000ff"
                    size='large'
                />
                </Overlay>
        </> 
        // */}

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10
    },
    date: {
        justifyContent:'space-around',
        alignItems: 'flex-start'
    },
    input: {
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    listItem: {
        textAlign: 'right',
        fontSize: 10,
        color: themes.fontColor
    },
    overLay: {
        height: '50%',
        width: '50%',
        borderRadius: 10
    },
    totalText: {
        fontSize: 16,
        fontFamily: 'mr800',
        color: themes.secondary
       },
})


export default SalesOrder