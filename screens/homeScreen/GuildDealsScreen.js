import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, FlatList, ScrollView} from 'react-native'
import { useMutation, useQuery, useSubscription  } from '@apollo/react-hooks'
import { Divider, Text, Card, Avatar, Icon, CheckBox, Overlay, FAB } from 'react-native-elements'
import { Table, TableWrapper, Row,  Cell } from 'react-native-table-component';
import _ from 'lodash'
import moment from 'moment'


import { COMMIT_GUILD_DEALS } from '../../queries/queries_mutation'
import { GET_GUILD_DEALS_STATUS } from '../../queries/queries_query'
import { GUILD_DEAL_TRANSACTION_ADDED } from '../../queries/queries_subscription'
import themes from "../../assets/themes";


const { height, width } = Dimensions.get("window");
const cardGap = 16;
const cardWidth = (width - cardGap * 3) / 2.2;



const GuildDeals = ({navigation, route}) => {
    const { guildDeals, myGuild } = route.params

    const [activeGuildDeals, setActiveGuildDeals] = useState()
    const [guildDealOverlay, setGuildDealOverlay] = useState(false)
    const [guildDealStatusOverlay, setGuildDealStatusOverlay] = useState(false)
    const [guildDealChose, setGuildDealChose] = useState(null)
    const [guildDealsStatus, setGuildDealsStatus] = useState(null)
    const [vendorChose, setVendorChose] = useState(null)
    const [tableData_guildDeal, setTableData_guildDeal] = useState(null)
    const [tableData_guildDealStatus, setTableData_guildDealStatus] = useState(null)
    const [totalAmount, setTotalAmount] = useState(0)


    const tableHeader_guildDeals = ['level', 'condition', 'amount', 'Rwd.Items', 'Rwd.Amt.']
    const tableHeader_guildDealsStatus = ['date', 'name', 'order', 'amount']

    useSubscription(GUILD_DEAL_TRANSACTION_ADDED, {
        onSubscriptionData({subscriptionData}) {
           const { data: { guildDealTransactionAdded }} = subscriptionData
           console.log('guilddealtransactionadded',guildDealTransactionAdded)

            const newDealsStatus = guildDealsStatus
            const index = _.findIndex(newDealsStatus, deal => {
                return guildDealTransactionAdded.vendor == deal.vendor
            })
            if(index >= 0) {
                newDealsStatus[index].transactions.push(guildDealTransactionAdded)
                setGuildDealsStatus(newDealsStatus)
            }
        }
    })

    useQuery(GET_GUILD_DEALS_STATUS,{ 
        variables: { guildFullName: myGuild},
        async onCompleted({getGuildDealsStatus}) {
                if(getGuildDealsStatus) {
                    setGuildDealsStatus(getGuildDealsStatus)
                }
        }         
    })
    

    const [commitGuildDeals] = useMutation(COMMIT_GUILD_DEALS, {
       async update(cache, { data: { commitGuildDeals}}) {
           const data = cache.readQuery({ query: GET_GUILD_DEALS_STATUS})
           data.getGuildDealsStatus.push(commitGuildDeals)
           cache.writeQuery({ query: GET_GUILD_DEALS_STATUS, data })
           guildDealsStatus.push(commitGuildDeals)
       },
       refetchQueries:[{query: GET_GUILD_DEALS_STATUS, variables: {guildFullName: myGuild}}],
       awaitRefetchQueries: true
    })

    const toggleOverlay = () => {
        setGuildDealOverlay(!guildDealOverlay)
      };

    const toggleStatusOverlay = () => {
        setGuildDealStatusOverlay(!guildDealStatusOverlay)
      };

    useEffect(() => {
        if (guildDealsStatus) {
          let ok;
          const activeDeals = guildDeals.map((deal) => {
            const index = _.findIndex(guildDealsStatus, (item) => {
              return (item.guildDealId == deal._id);
            });
            if (index < 0) {
              ok = true;
              return deal;
            }
          });
          // console.log(activeDeals)
          if (ok) {
            setActiveGuildDeals(activeDeals)
          } else {
            setActiveGuildDeals(false)
          }
        } else {
          // console.log(guildDeals)
        setActiveGuildDeals(guildDeals)
        }
    }, [guildDeals, guildDealsStatus])
    

    const specialCell = ( index, cellData, cellIndex ) => {
        
        switch (cellIndex) {
            case 1: 
            if (index !== 0 ) {
                    return ''
                } else {
                    return cellData
                }
                // break;
            case 3: 
             return (<Icon name='coins' type="font-awesome-5"
             color="#757575" />)

             default:
                return cellData
            }
            
        }
       
// guild deal details overlay window
    const renderGuildDeals = ({ item }) => (
    <Card containerStyle={styles.card}>
                <View style={styles.titleContainer}>
                     <Avatar 
                        source={{ uri: item.vendorLogo }}
                        resizeMode='contain'
                        containerStyle={{width: 50, height: 50, marginBottom: 20}}
                     /> 
                     <Card.Title>&nbsp;&nbsp;&nbsp;{item.vendor}</Card.Title>
                </View>
                
                <Card.Divider />

                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 13}}>Type:&nbsp;{item.guildDealType}</Text>
                </View>

                <Card.Divider />

                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 13}}>Redeem:&nbsp;{item.dealRedeemTerm}</Text>
                </View>

                <Card.Divider />

               <View style={styles.dateContainer}>
                    <Text style={{fontSize: 10}}>{moment(new Number(item.dateFrom)).format("YYYY-MM-DD")}&nbsp;To</Text>
                    <Text style={{fontSize: 10}}>&nbsp;{moment(new Number(item.dateTo)).format("YYYY-MM-DD")}</Text>
               </View>

               <Card.Divider />
               <View style={styles.actionsContainer}>
               <Icon 
                    name="search-dollar"
                    type="font-awesome-5"
                    color="#757575"
                    onPress={() => {
                        const tableData = item.guildDealLevels.map((level, i)=> {
                            const rowData = []
                             rowData.push(i+1)
                             rowData.push(level.guildDealCondition)
                             rowData.push('$' + level.guildDealAmount)
                             rowData.push(level.rewardItemsSelected[0])
                             rowData.push(level.rewardAmount)
                             return rowData
                        })
                        console.log('tableData', tableData)
                        setTableData_guildDeal(tableData)
                        setGuildDealOverlay(true)
                    }}
                />
                 <CheckBox
                        checked={vendorChose == item.vendor}
                        onPress={() => {
                          setVendorChose(item.vendor)
                          setGuildDealChose(item)
                        }}
                      />
               </View>
        
    </Card>
  );

// guild deal status overlay window
    const renderGuildDealsStatus = ({ item }) => (
    <Card containerStyle={styles.card}>
                <View style={styles.titleContainer}>
                     <Avatar 
                        source={{ uri: item.vendorLogo }}
                        resizeMode='contain'
                        containerStyle={{width: 50, height: 50, marginBottom: 20}}
                     /> 
                     <Card.Title>&nbsp;&nbsp;&nbsp;{item.vendor}</Card.Title>
                </View>
                
                <Card.Divider />

                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 13}}>Type:&nbsp;{item.guildDealType}</Text>
                </View>

                <Card.Divider />

                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 13}}>Redeem:&nbsp;{item.redeemTerm}</Text>
                </View>

                <Card.Divider />

               <View style={styles.dateContainer}>
                    <Text style={{fontSize: 10}}>{moment(new Number(item.dateFrom)).format("YYYY-MM-DD")}&nbsp;To</Text>
                    <Text style={{fontSize: 10}}>&nbsp;{moment(new Number(item.dateTo)).format("YYYY-MM-DD")}</Text>
               </View>

               <Card.Divider />
               <View style={styles.actionsContainer}>
               <Icon 
                    name="search-dollar"
                    type="font-awesome-5"
                    color="#757575"
                    onPress={() => {
                        let total = 0
                        const tableData = item.transactions.map((deal, i)=> {
                            const rowData = []
                             rowData.push(moment(new Number(deal.date)).format("YYYY-MM-DD"))
                             rowData.push(deal.resident)
                             rowData.push(deal.transactionId)
                             rowData.push('$' + deal.purchaseAmount.toFixed(2))
                             total = total + deal.purchaseAmount
                             return rowData
                        })
                        setTotalAmount(total)
                        // console.log('total', totalAmount)
                        // console.log('tableDataStatus', tableData)
                        setTableData_guildDealStatus(tableData)
                        setGuildDealStatusOverlay(true)
                    }}
                />
               </View>
        
    </Card>
  );

    return (
        <View>
            {/* Guild Deals */}
            <View style={{marginVertical: 5}}>
                <Text style={styles.subHeader}>Guild Deals</Text>
                {activeGuildDeals&&<FlatList
                    data={activeGuildDeals}
                    renderItem={renderGuildDeals}
                    keyExtractor={item => item._id} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                
                }
                {!activeGuildDeals&&<Text style={styles.dealInfo}>You already commit all guild deals</Text>}
                
                {/* <View> */}
                {activeGuildDeals&&<FAB
                        icon={{ name: "done", type: "material", color: "white" }}
                        onPress={() => {
                            const guildDealIds = []
                            console.log('guildDealId', guildDealChose._id)
                            guildDealIds.push(guildDealChose._id)
                            const input = {
                                guildFullName: myGuild,
                                guildDealIds: guildDealIds
                              };
                              commitGuildDeals({ variables: { input }})
                        }}
                        disabled={guildDealChose == null}
                        disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                        buttonStyle={{
                        backgroundColor: themes.primary,
                        }}
                        placement='right'
                    />}
                {/* </View> */}
                
            </View>

            {/* Guild Deals Status */}
            <View style={{marginVertical: 5}}>
                <Text style={styles.subHeader}>Commit Deals Status</Text>
                {guildDealsStatus&&<FlatList
                    data={guildDealsStatus}
                    renderItem={renderGuildDealsStatus}
                    keyExtractor={item => item.guildDealId} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />}

                {!guildDealsStatus&&<Text style={styles.dealInfo}>No guild deals committed yet</Text>}
                
            </View>

            {/* Guild Deals Overlay */}
            <Overlay
                isVisible={guildDealOverlay}
                onBackdropPress={toggleOverlay}
                overlayStyle={{width: width * 0.95, height: height * 0.4}}
                >
                    <Text style={{fontSize: 16, color: 'red', textAlign: 'center', marginVertical: 10}}>Deal Details</Text>
               {tableData_guildDeal!=null&&(<Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={tableHeader_guildDeals} style={styles.head} textStyle={styles.text}/>
                    { 
                        tableData_guildDeal.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                            {
                            rowData.map((cellData, cellIndex) => (
                                // <Cell key={cellIndex} data={cellIndex === 1 && index !== 0 ? '' : cellData} textStyle={styles.text}/>
                                <Cell key={cellIndex} data={specialCell(index, cellData, cellIndex)} textStyle={styles.text}/>
                            ))
                            }
                        </TableWrapper>
                        ))
                    }
                </Table>)} 

            </Overlay>  

             {/* Guild Deals Status Overlay */}
             <Overlay
                isVisible={guildDealStatusOverlay}
                onBackdropPress={toggleStatusOverlay}
                overlayStyle={{width: width * 0.95, height: height * 0.4}}
                >
                    <Text style={{fontSize: 16, color: 'red', textAlign: 'center', marginVertical: 10}}>Deal Details</Text>
               {tableData_guildDealStatus!=null&&(
               <ScrollView showsVerticalScrollIndicator={false}>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={tableHeader_guildDealsStatus} style={styles.head} textStyle={styles.text}/>
                    { 
                        tableData_guildDealStatus.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                            {
                            rowData.map((cellData, cellIndex) => (
                                // <Cell key={cellIndex} data={cellIndex === 1 && index !== 0 ? '' : cellData} textStyle={styles.text}/>
                                <Cell key={cellIndex} data={cellData} textStyle={styles.text}/>
                            ))
                            }
                        </TableWrapper>
                        ))
                    }
                </Table>
                <Divider style={{marginVertical: 1}}/> 
                <Text style={{fontSize: 10, color: 'red', textAlign: 'right', fontWeight: 'bold', marginRight: 33}}>Total Amount&nbsp;&nbsp;&nbsp;${totalAmount.toFixed(2).toString()}</Text>
                </ScrollView>)} 

            </Overlay>  
        </View>
    )
}

const styles = StyleSheet.create({

    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    card: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: cardWidth,
        height: height / 3.3,
        padding: 1
    },
   
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5
    },

    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5,
    },

    dealInfo: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center'
    },


    subHeader: {
        backgroundColor : "#2089dc",
        color : "white",
        textAlign : "center",
        paddingVertical : 5,
        marginBottom : 5
      },

       titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    },

    head: { height: 40, backgroundColor: '#808B97' },

    text: { margin: 10, fontSize: 11 },

    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },

    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },

    btnText: { textAlign: 'center', color: '#fff' }
})

export default GuildDeals