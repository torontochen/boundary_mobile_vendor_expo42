import React, { useState,  useCallback } from 'react'
import { View, Text, TouchableOpacity , ScrollView, Dimensions,ActivityIndicator }  from 'react-native'
import { Icon, Overlay, Image  } from 'react-native-elements'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { LineChart } from "react-native-chart-kit"
import moment from 'moment'


import {GET_VENDOR_SALES_INFO} from "../../queries/queries_query"
import themes from '../../assets/themes'

const { height, width } = Dimensions.get("window");

const ReportSceen = ({ route }) => {
     const { vendor } = route.params
     // console.log('vendor', vendor)

     const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

     const [isMonthToDateSalesOpen, setIsMonthToDateSalesOpen] = useState(false)
     const [isMonthToDateOrdersOpen, setIsMonthToDateOrdersOpen] = useState(false)
     const [isYearToDateSalesOpen, setIsYearToDateSalesOpen] = useState(false)
     const [isYearToDateOrdersOpen, setIsYearToDateOrdersOpen] = useState(false)
     const [monthToDateSales, setMonthToDateSales] = useState()
     const [salesMTD, setSalesMTD] = useState(0)
     const [monthToDateOrders, setMonthToDateOrders] = useState()
     const [ordersMTD, setOrdersMTD] = useState(0)

     const [yearToDateSales, setYearToDateSales] = useState()
     const [salesYTD, setSalesYTD] = useState(0)
     const [yearToDateOrders, setYearToDateOrders] = useState()
     const [ordersYTD, setOrdersYTD] = useState(0)

     const goDetails = useCallback((data ) => {
          const { monthToDateSales, yearToDateSales } = data.getVendorSalesInfo
               let salesMTDA = 0
               let ordersMTDA = 0
               let salesYTDA = 0
               let ordersYTDA = 0
               const mtd = monthToDateSales.map(item => {
                    salesMTDA += item.sales
                    return item.sales
               })
               setSalesMTD(salesMTDA)
               setMonthToDateSales(mtd)
               const mtdo = monthToDateSales.map(item => {
                    ordersMTDA += item.orders
                    return item.orders
               })
               setOrdersMTD(ordersMTDA)
               setMonthToDateOrders(mtdo)
               const ytd = yearToDateSales.map(item => {
                    salesYTDA += item.sales
                    return item.sales
               })
               setSalesYTD(salesYTDA)
               setYearToDateSales(ytd)
               const ytdo = yearToDateSales.map(item => {
                    ordersYTDA += item.orders
                    return item.orders
               })
               setOrdersYTD(ordersYTDA)
               setYearToDateOrders(ytdo)
      
        }, [salesInfoData])


     const { data: salesInfoData, loading } = useQuery(GET_VENDOR_SALES_INFO, { variables: { vendor: vendor.businessTitle }})
     const [getVendorSalesInfo, {loading: refreshLoading}] = useLazyQuery(GET_VENDOR_SALES_INFO, {

         async onCompleted({getVendorSalesInfo}){
              console.log('getVendorSalesInfo', getVendorSalesInfo)
          const { monthToDateSales, yearToDateSales } = getVendorSalesInfo
          const mtd = monthToDateSales.map(item => {
               return item.sales
          })
          setMonthToDateSales(mtd)
          const mtdo = monthToDateSales.map(item => {
               return item.orders
          })
          setMonthToDateOrders(mtdo)
          const ytd = yearToDateSales.map(item => {
               return item.sales
          })
          setYearToDateSales(ytd)
          const ytdo = yearToDateSales.map(item => {
               return item.orders
          })
          setYearToDateOrders(ytdo)
         },
         fetchPolicy: 'network-only'
     })
    
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
     // roundingIncrement: 5  
          }).format(value)
     }

     const formatIntAmount = (value) => {
          return new Intl.NumberFormat('en-US', {  
                         }).format(value)
     }

     const monthLabel = (sales) => {
          console.log('sales', sales)
               let mLabel = []
               for (let i = 0; i < sales.length; i++) {
                    mLabel.push((i + 1).toString())
               }
               console.log('mLabel', mLabel)
               return mLabel
     }

     const yearLabel = (sales) => {
          console.log('sales', sales)
               let yLabel = []
               for (let i = 0; i < sales.length; i++) {
                    yLabel.push(month[i])
               }
               console.log('yLabel', yLabel)
               return yLabel
     }

     const monthlySales = (sales) => {

          const mtd = sales.map(item => {
               return item.sales
          })
          return mtd
     }

     const monthlyOrders = (sales) => {
          return sales.map(item => {
               return item.orders
          })
     }
     const yearlySales = (sales) => {
          return sales.map(item => {
               return item.sales
          })
     }

     const yearlyOrders = (sales) => {
          return sales.map(item => {
               return item.orders
          })
     }

     const toggleOverlay = () => {
          setIsMonthToDateSalesOpen(false)
          setIsMonthToDateOrdersOpen(false)
          setIsYearToDateSalesOpen(false)
          setIsYearToDateOrdersOpen(false)
     };
      


     return (
          <View>
               
              {salesInfoData?(
             <ScrollView contentContainerStyle={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
               {/* Daily Sales */}
               <View style={{
                    width: width * 0.95, 
                    flexDirection: 'column', 
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    backgroundColor: themes.primary,
                    borderRadius: 10,
                    padding: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                         <Text style={{fontSize: 24, fontWeight: 'bold',  color: 'white',  marginVertical: 3}}>{moment(Date.now()).format("YYYY-MM-DD")}</Text>
                         <Icon 
                         name='refresh' 
                         type='font-awesome' 
                         color='white' 
                         size={20} 
                         onPress={()=>{
                              getVendorSalesInfo({ variables: { vendor: vendor.businessTitle }})
                         }}
                         style={{marginHorizontal:8}}/>
                         </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginVertical: 3}}>
                         <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>Sales:&nbsp;{formatCurrencyAmount(salesInfoData.getVendorSalesInfo.dailySales.sales)}</Text>
                         <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>Orders:&nbsp;{formatAmount(salesInfoData.getVendorSalesInfo.dailySales.orders)}</Text>
                    </View>
               </View>
              {/* MonthToDate Sales */}
              <TouchableOpacity onLongPress={()=>{
                   setIsMonthToDateSalesOpen(true)
                   goDetails(salesInfoData)
              }}>
                   <LineChart
               data={{
                    labels: monthLabel(salesInfoData.getVendorSalesInfo.monthToDateSales),
                    datasets: [
                      {
                        data: monthlySales(salesInfoData.getVendorSalesInfo.monthToDateSales),
                        color: 
                    //     (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
                        (opacity = 1) => 'white', 
                        strokeWidth: 2 // optional
                      }
                    ],
                    legend: ["MonthToDate Sales($)"] // optional
                  }
               }
               width={width * 0.95}
               height={height * 0.2}
               yLabelsOffset={5}
               xLabelsOffset={-5}
               verticalLabelRotation={30}
               chartConfig={
                    {
                         backgroundGradientFrom: themes.primary,
                         backgroundGradientFromOpacity: 1,
                         backgroundGradientTo: themes.primary,
                         backgroundGradientToOpacity: 1,
                         color: 
                         (opacity = 1) => 'white',
                         // (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                         strokeWidth: 2, // optional, default 3
                         barPercentage: 0.5,
                         useShadowColorFromDataset: false // optional,
                         
                       }
               }
               bezier
               style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    shadowColor: themes.shade,
                    // "#212121",
                    shadowRadius: 10,
                    shadowOffset: { width: 5, height: 3 },
                    shadowOpacity: 0.2,
                    padding: 2
                  }}
                  withInnerLines={false}
               /> 
              </TouchableOpacity>
              
               {/* MonthToDate Orders */}
               <TouchableOpacity onLongPress={()=>{setIsMonthToDateOrdersOpen(true)
                   goDetails(salesInfoData)
               }}>
                    <LineChart
                         data={{
                              labels: monthLabel(salesInfoData.getVendorSalesInfo.monthToDateSales),
                              datasets: [
                              {
                              data: monthlyOrders(salesInfoData.getVendorSalesInfo.monthToDateSales),
                              color: 
                              //     (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
                              (opacity = 1) => 'white', 
                              strokeWidth: 2 // optional
                              }
                              ],
                              legend: ["MonthToDate Orders"] // optional
                         }
                         }
                         width={width * 0.95}
                         height={height * 0.2}
                         verticalLabelRotation={30}
                         xLabelsOffset={-5}
                         chartConfig={
                              {
                                   backgroundGradientFrom: themes.primary,
                                   backgroundGradientFromOpacity: 1,
                                   backgroundGradientTo: themes.primary,
                                   backgroundGradientToOpacity: 1,
                                   color: 
                                   (opacity = 1) => 'white',
                                   // (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                   strokeWidth: 2, // optional, default 3
                                   barPercentage: 0.5,
                                   useShadowColorFromDataset: false // optional,
                                   
                              }
                         }
                         bezier
                         style={{
                              marginVertical: 8,
                              borderRadius: 16,
                              shadowColor: themes.shade,
                              // "#212121",
                              shadowRadius: 10,
                              shadowOffset: { width: 5, height: 3 },
                              shadowOpacity: 0.2,
                              padding: 2
                         }}
                         withInnerLines={false}
                         />
               </TouchableOpacity>
               
               {/* YearToDate Sales */}
               <TouchableOpacity onLongPress={()=>{
                    setIsYearToDateSalesOpen(true)
                   goDetails(salesInfoData)
               }}>
                    <LineChart
                         data={{
                              labels: yearLabel(salesInfoData.getVendorSalesInfo.yearToDateSales),
                              datasets: [
                              {
                              data: yearlySales(salesInfoData.getVendorSalesInfo.yearToDateSales),
                              color: 
                              //     (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
                              (opacity = 1) => 'white', 
                              strokeWidth: 2 // optional
                              }
                              ],
                              legend: ["YearToDate Sales($)"] // optional
                         }
                         }
                         width={width * 0.95}
                         height={height * 0.2}
                         yLabelsOffset={-3}
                         xLabelsOffset={-5}
                         verticalLabelRotation={30}
                         chartConfig={
                              {
                                   backgroundGradientFrom: themes.primary,
                                   backgroundGradientFromOpacity: 1,
                                   backgroundGradientTo: themes.primary,
                                   backgroundGradientToOpacity: 1,
                                   color: 
                                   (opacity = 1) => 'white',
                                   // (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                   strokeWidth: 2, // optional, default 3
                                   barPercentage: 0.5,
                                   useShadowColorFromDataset: false // optional,
                                   
                              }
                         }
                         bezier
                         style={{
                              marginVertical: 8,
                              borderRadius: 16,
                              shadowColor: themes.shade,
                              // "#212121",
                              shadowRadius: 10,
                              shadowOffset: { width: 5, height: 3 },
                              shadowOpacity: 0.2,
                              padding: 2,
                              fontSize: 10
                         }}
                         withInnerLines={false}
                         />
               </TouchableOpacity>
               
               {/* YearToDate Orders */}
               <TouchableOpacity onLongPress={()=>{
                    setIsYearToDateOrdersOpen(true)
                   goDetails(salesInfoData)
                    }}>
                    <LineChart
                    data={{
                         labels: yearLabel(salesInfoData.getVendorSalesInfo.yearToDateSales),
                         datasets: [
                         {
                         data: yearlyOrders(salesInfoData.getVendorSalesInfo.yearToDateSales),
                         color: 
                         //     (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
                         (opacity = 1) => 'white', 
                         strokeWidth: 2 // optional
                         }
                         ],
                         legend: ["YearToDate Orders"] // optional
                    }
                    }
                    width={width * 0.95}
                    height={height * 0.2}
                    verticalLabelRotation={30}
                    xLabelsOffset={-5}
                    chartConfig={
                         {
                              backgroundGradientFrom: themes.primary,
                              backgroundGradientFromOpacity: 1,
                              backgroundGradientTo: themes.primary,
                              backgroundGradientToOpacity: 1,
                              color: 
                              (opacity = 1) => 'white',
                              // (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                              strokeWidth: 2, // optional, default 3
                              barPercentage: 0.5,
                              useShadowColorFromDataset: false // optional,
                              
                         }
                    }
                    bezier
                    style={{
                         marginVertical: 8,
                         borderRadius: 16,
                         shadowColor: themes.shade,
                         // "#212121",
                         shadowRadius: 10,
                         shadowOffset: { width: 5, height: 3 },
                         shadowOpacity: 0.2,
                         padding: 2
                    }}
                    withInnerLines={false}
                    />     
               </TouchableOpacity>
              
               {/* } */}
              
               
              
          </ScrollView>  
          ):(
               <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon 
                        name='point-of-sale'
                        type='material-community'
                        size={80}
                        color={themes.shade4}
                    />
                    <Text style={{ fontFamily: 'mr900', fontSize: 22, color: themes.shade4, fontWeight: 'bold'}}>No Sales</Text>
               </View>
          )} 

          {/* MonthToDate Detailed Sales Overlay */}
          <Overlay
            isVisible={isMonthToDateSalesOpen}
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.77}}
            >
          <View><Text style={{fontSize: 24, fontWeight: 'bold',  color: themes.primary, textAlign: 'center', marginVertical: 4}}>
               {moment(Date.now()).format("YYYY-MM-DD") + ' (' + formatCurrencyAmount(salesMTD) + ')'} </Text></View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', width: '100%', height: '100%'}}>
              {monthToDateSales&&monthToDateSales.map((item, i) => {
                   return <View  key={i} style={{width: width * 1 / 5.3, height: height * 0.085, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                              <Text style={{marginVertical: 2, color: themes.accent}}>{(i+1).toString()}</Text>
                              <Text style={{marginVertical: 2, color: themes.fontColor}}>{formatCurrencyAmount(item)}</Text>
                         </View>
              })}
            </View>
          </Overlay>  

          {/* MonthToDate Detailed Orders Overlay */}
          <Overlay
            isVisible={isMonthToDateOrdersOpen}
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.77}}
            >
          <View><Text style={{fontSize: 24, fontWeight: 'bold',  color: themes.primary, textAlign: 'center', marginVertical: 4}}>
               {moment(Date.now()).format("YYYY-MM-DD") + ' (' + formatIntAmount(ordersMTD) + ')' } </Text></View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', width: '100%', height: '100%'}}>
              {monthToDateOrders&&monthToDateOrders.map((item, i) => {
                   return <View key={i} style={{width: width * 1 / 5.3, height: height * 0.085, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                              <Text style={{marginVertical: 2, color: themes.accent}}>{(i+1).toString()}</Text>
                              <Text style={{marginVertical: 2, color: themes.fontColor}}>{formatAmount(item)}</Text>
                         </View>
              })}
            </View>
          </Overlay>   

          {/* YearToDate Detailed Sales Overlay */}
          <Overlay
            isVisible={isYearToDateSalesOpen}
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.45}}
            >
          <View><Text style={{fontSize: 24, fontWeight: 'bold',  color: themes.primary, textAlign: 'center', marginVertical: 4}}>
               {moment(Date.now()).format("YYYY-MM-DD") + ' (' + formatCurrencyAmount(salesYTD) + ')'} </Text></View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', width: '100%', height: '100%'}}>
              {yearToDateSales&&yearToDateSales.map((item, i) => {
                   return <View  key={i} style={{width: width * 1 / 4, height: height * 0.085, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                              <Text style={{marginVertical: 2, color: themes.accent}}>{month[i]}</Text>
                              <Text style={{marginVertical: 2, color: themes.fontColor}}>{formatCurrencyAmount(item)}</Text>
                         </View>
              })}
            </View>
          </Overlay> 

          {/* YearToDate Detailed Orders Overlay */}
          <Overlay
            isVisible={isYearToDateOrdersOpen}
            onBackdropPress={toggleOverlay}
            overlayStyle={{width: width * 0.9, height: height * 0.4}}
            >
          <View><Text style={{fontSize: 24, fontWeight: 'bold',  color: themes.primary, textAlign: 'center', marginVertical: 4}}>
               {moment(Date.now()).format("YYYY-MM-DD") + ' (' + formatIntAmount(ordersYTD) + ')'} </Text></View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', width: '100%', height: '100%'}}>
              {yearToDateOrders&&yearToDateOrders.map((item, i) => {
                   return <View  key={i} style={{width: width * 1 / 5, height: height * 0.085, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                              <Text style={{marginVertical: 2, color: themes.accent}}>{month[i]}</Text>
                              <Text style={{marginVertical: 2, color: themes.fontColor}}>{formatAmount(item)}</Text>
                         </View>
              })}
            </View>
          </Overlay>     

           {/*  fetching overlay */}
               <Overlay
               visible={loading}
               fullScreen
               >
                    <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    
                    <Image
                    source={require("../../assets/Screen_Shot_2022-10-14_at_11.56.26_AM-removebg-preview.png")}
                    style={{width: 200, height: 50, alignSelf: 'center', marginBottom: 50}}
                    resizeMode="contain"
                    ></Image>
                    <Image source={{uri: 'https://www.animatedimages.org/data/media/106/animated-man-image-0394.gif'}} style={{width: 80, height: 80}} resizeMode='contain' />

                    </View>
          
               </Overlay>

              {/* refresh overlay */}
               <Overlay
               visible={refreshLoading}
               >
                    
                    <ActivityIndicator
                    color={themes.primary}
                    size='large'
                    />
               </Overlay>
          </View>
     )
          
         
     
}

export default ReportSceen