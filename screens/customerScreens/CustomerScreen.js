import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { Card, Icon, Rating, ListItem,  Overlay, Input, Button, Image} from 'react-native-elements'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import moment from 'moment'
import _ from 'lodash'

import themes from "../../assets/themes";
import {  GET_CUSTOMER_RATINGS, GET_PRODUCT_RATINGS, GET_RESIDENT_LIST } from '../../queries/queries_query';
import { SEND_MESSAGE } from '../../queries/queries_mutation'
import { MESSAGE_RECEIVED, CUSTOMER_RATING_ADDED, PRODUCT_RATING_ADDED } from '../../queries/queries_subscription';

const { height, width } = Dimensions.get("window");

const CustomerScreen = ({ navigation, route }) => {
  const { vendor:vendorData } = route.params
  // console.log('vendor in customer screen', vendorData)

    const [receiver, setReceiver] = useState()
    const [title, setTitle] = useState()
    const [realName, setRealName] = useState()
    const [fullName, setFullName] = useState()
    const [messages, setMessages] = useState()
    const [message, setMessage] = useState('')
    const [isMsgOverlayOpen, setIsMsgOverlayOpen] = useState(false)
    
    // console.log('singleItem', singleItem)
    // console.log('vendor', vendor)

    

    const toggleMsgOverlay = () => {
     setMessage('')
     setIsMsgOverlayOpen(!isMsgOverlayOpen)
    };
    const [sendMessage] = useMutation(SEND_MESSAGE)
  

    const { data: productRatingData, loading: productRatingDataLoading } = useQuery(GET_PRODUCT_RATINGS, {variables:{vendor:vendorData.businessTitle}} )
    const { data: customerRatingData, loading: customerRatingLoading } = useQuery(GET_CUSTOMER_RATINGS, {variables:{vendor:vendorData.businessTitle}} )
    const { data: residentListData } = useQuery(GET_RESIDENT_LIST)
    useEffect(() => {
      if(productRatingData&&customerRatingData) {
        const {  messages } = vendorData
        // console.log('message', messages)
        const { getProductRatings } = productRatingData
        // console.log('getProductRatings',getProductRatings)
        const { getCustomerRatings } = customerRatingData
         const { getResidentList : list } = residentListData
                         
         getCustomerRatings.map((item, i, array) => {
            const index = list.findIndex(it => it.residentName == item.resident)
            array[i] = {...array[i], fullName: item.customerName, sender: item.resident} 
        })
        getProductRatings.map((item, i, array) => {
            const index = list.findIndex(it => it.residentName == item.resident)
            array[i] = {...array[i], fullName: item.customerName, sender: item.resident} 
        })
        // console.log('getCustomerRatings', getCustomerRatings)
        const newMessages = [...messages, ...getProductRatings, ...getCustomerRatings ]
       
        console.log('messages',newMessages)
        setMessages(newMessages)
      }
    }, [productRatingData, customerRatingData, residentListData])


    // const ratingCompleted = (finalRating) => {
    //   console.log('Rating is: ' + finalRating);
    //   const newRating = Math.floor(finalRating) == Math.round(finalRating) 
    //                     ? Math.floor(finalRating)
    //                     : Math.round(finalRating) + 0.5 >= 5 ? 5 : Math.round(finalRating)
    //   console.log('new rating', newRating)                 
    //   setRating(newRating)
    // };

    // const ratingFace = (rating) => {
    //     if(rating <= 2) {
    //     return <Icon name='frown' size={28} type='font-awesome-5' color='red'/>
    //     }
    //     if(rating > 2 && rating < 4) {
    //       return <Icon name='meh' size={28} type='font-awesome-5' color='gold'/>
    //     }
    //     if(rating >= 4) {
    //       return <Icon name='smile' size={28} type='font-awesome-5' color='green'/>
    //     }
    // }

    useSubscription(CUSTOMER_RATING_ADDED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { customerRatingAdded }} = subscriptionData
        // console.log('customerRatingadded', customerRatingAdded)
        const {vendor} = customerRatingAdded
        if(vendor==vendorData.businessTitle) {
          const messageList = [...messages]
          messageList.push(customerRatingAdded)
          setMessages(messageList)
        }
      }
    })
    useSubscription(PRODUCT_RATING_ADDED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { productRatingAdded }} = subscriptionData
        // console.log('productRatingAdded',productRatingAdded)
        const {vendor} = productRatingAdded
        if(vendor==vendorData.businessTitle) {
          const messageList = [...messages]
          messageList.push(productRatingAdded)
          setMessages(messageList)
        }
      }
    })
    useSubscription(MESSAGE_RECEIVED, {
      onSubscriptionData({subscriptionData}) {
        const { data: { messageReceived }} = subscriptionData
        // console.log('messageReceived', messageReceived)
        const {receiver, receiverType} = messageReceived
        if(receiver == vendorData.businessTitle && receiverType == 'vendor') {
          const messageList = [...messages]
          messageList.push(messageReceived)
          setMessages([...messageList])
        }
      }
    })


    
    return (
      <View style={{flex: 1}}>
        {/* messages */}
         <ScrollView style={{height: height * 2}} >
            {messages!=null&&
              messages.map((item, i) => {
                return (
                  <ListItem key={i} bottomDivider style={{paddingHorizontal: 5}}>
                    {item.rating&&<ListItem.Content>
                      <View style={styles.titleContainer}>
                        <ListItem.Title style={{fontSize: 16, marginRight: 5}}>{item.fullName}</ListItem.Title>
                        <TouchableWithoutFeedback 
                        onPress={()=> {
                          setReceiver(item.sender)
                          setTitle(item.itemCode)
                          // console.log('residentListDta', residentListData)
                          // const { getResidentList : list } = residentListData
                          // const index = list.findIndex(it => it.residentName == item.customerName)
                          setFullName(item.fullName)
                          setIsMsgOverlayOpen(!isMsgOverlayOpen)
                          setMessage('')
                        }}>
                          <Icon type='material' name='message' color={themes.primary} size={20}/>
                        </TouchableWithoutFeedback>
                      </View>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', fontSize: 8}}>
                    <Rating
                        type="star"
                        fractions={20}
                        imageSize={10}
                        style={{ paddingVertical: 10, fontSize: 8 }}
                        readonly
                        startingValue={item.rating}
                    />
                    {item.itemCode&&<Text>Item:&nbsp;{item.itemCode}</Text>}
                    <Text style={{fontSize: 10}}>{moment(Number(item.time)).format("YYYY-MM-DD HH:mm")}</Text>
                    </View>
                    <ListItem.Subtitle style={{fontSize: 12}} numberOfLines={3}
                    >{item.comments}</ListItem.Subtitle>
                  </ListItem.Content>}

                  {item.text&&<ListItem.Content>
                    <View style={styles.titleContainer}>
                        <ListItem.Title style={{fontSize: 16, marginRight: 5}}>{item.fullName }</ListItem.Title>
                        <TouchableWithoutFeedback
                        onPress={()=> {
                          setReceiver(item.sender)
                          setTitle(item.title)
                          setFullName(item.fullName)
                          setIsMsgOverlayOpen(!isMsgOverlayOpen)
                        }}>
                          <Icon type='material' name='message' color={themes.primary} size={20}/>
                        </TouchableWithoutFeedback>
                      </View>

                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', fontSize: 8}}>
                        <Text style={{fontSize: 10}}>{moment(Number(item.time)).format("YYYY-MM-DD HH:mm")}</Text>
                      </View>

                      <ListItem.Subtitle style={{fontSize: 12}} numberOfLines={3}
                    >{item.text}</ListItem.Subtitle>
                    </ListItem.Content>}

                </ListItem>
                )
              }) 
            }
        </ScrollView> 
     
    {/* <FAB
          visible={visible}
          icon={{ name: 'add', color: 'white' }}
          color="green"
          style={{position:'absolute',bottom: 10, right: 10, alignSelf:'flex-end'}}
        /> */}
        

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
                sendMessage({ variables: {sender: vendorData.businessTitle,
                                          receiver,
                                          receiverType: 'resident',
                                          text: message,
                                          time: Date.now().toString(),
                                          fullName: fullName,
                                          guild: '',
                                          title
                                                }})
                setIsMsgOverlayOpen(false)
            }}
            title="Ok"
            disabled={!message}
            disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
            buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
                width: '90%'
            }}
            />
          </View>
        </Card>
      </Overlay>

      {/*  fetching overlay */}
      <Overlay
        visible={productRatingDataLoading||customerRatingLoading}
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

        {/* <ActivityIndicator
            color={themes.primary}
            size='large'
        /> */}
      </Overlay>

      </View>
    )
}

 const styles = StyleSheet.create({
    
      titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 2
      },
  
     
 })

export default CustomerScreen