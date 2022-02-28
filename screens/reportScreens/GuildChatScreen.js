import React, {useState, useEffect, useCallback} from 'react'
import { View, Text, StyleSheet} from 'react-native'
import { useQuery, useMutation, useSubscription, useLazyQuery } from "@apollo/react-hooks";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { Image } from "react-native-elements"
import _ from "lodash"

import { GET_GUILD_ENROLLED, GET_CURRENT_RESIDENT, GET_GUILD_CHAT_MESSAGES } from "../../queries/queries_query"
import { SAVE_GUILD_CHAT } from "../../queries/queries_mutation"
import { GUILD_CHAT_MSG_ADDED } from "../../queries/queries_subscription"
import { guildLogos } from "../../assets/constData";


const GuildChatScreen = ({ navigation }) => {

const [guildEnrolled, setGuildEnrolled] = useState()
const [guildIcon, setGuildIcon] = useState()
const [resident, setResident] = useState()
const [messageList, setMessageList] = useState([])
const [user, setUser] = useState()

const { data: guildEnrolledData} = useQuery(GET_GUILD_ENROLLED)

   useEffect(() => {
     const { guildEnrolled: { isEnrolled }} = guildEnrolledData
     console.log('guildEnrolled', isEnrolled)
     setGuildEnrolled(isEnrolled)
   }, [guildEnrolledData])

const { data: residentData } = useQuery(GET_CURRENT_RESIDENT)

   useEffect(() => {
       if(residentData) {
        const { getCurrentResident } = residentData
        console.log('getCurrentResident', getCurrentResident)
       setResident(getCurrentResident)
       }
       
   }, [residentData])

const [getGuildChatMessages] = useLazyQuery(GET_GUILD_CHAT_MESSAGES, {
   async onCompleted ({ getGuildChatMessages }) {
       console.log('guild message',getGuildChatMessages)
       const messages = getGuildChatMessages.map(message => {
           return {
            _id: message.residentName + (Math.random() * 10000).toString(),
            text: message.message.data,
            createdAt: new Date(message.message.date),
            user: {
              _id: message.residentName,
              name: message.residentName,
              avatar: message.residentAvatar,
            },
           }
       })
       console.log(messages)
       const newMsg = _.reverse(messages)
        setMessageList(newMsg)
    }
})

const [saveGuildChat] = useMutation(SAVE_GUILD_CHAT)

useSubscription(GUILD_CHAT_MSG_ADDED, {
    onSubscriptionData({subscriptionData}) {
       const { data: { guildChatMsgAdded }} = subscriptionData
       console.log('guildchatmsgadded',guildChatMsgAdded)
        const { guildFullName,
            message: {
              author,
              data,
              type,
              date,
            },
            residentName,
            residentAvatar,
            rank} = guildChatMsgAdded

            if (guildFullName !== resident.guild.guildFullName || residentName == resident.residentName) return

        const messageAdded = {
            _id: residentName + (Math.random() * 10000).toString(),
            text: data,
            createdAt: new Date(date),
            user: {
              _id: residentName,
              name: residentName,
              avatar: residentAvatar,
            },
           }

       setMessageList(previousMessages => GiftedChat.append(previousMessages, messageAdded))
    }
})

const onSend = useCallback((messages = []) => {
    console.log('messages',messages)
    console.log('resident', resident)
    setMessageList(previousMessages => GiftedChat.append(previousMessages, messages))
    // const { residentName, _id, guild } = residentData.getCurrentResident
    const guildMsgInput = {
        author: resident.residentName,
        data: messages[0].text ,
        type: 'text',
        date:  messages[0].createdAt.toString()
      }
      const variables = {
        residentId: resident._id,
        guildFullName: resident.guild.guildFullName,
        input: guildMsgInput
      }
      saveGuildChat({ variables})

  }, [resident])

// function renderBubble(props) {
//     return (
//         <Bubble
//             {...props}
//             wrapperStyle={{
//               left: {
//                 backgroundColor: '#d3d3d3',
//               },
//             }}
//         />
//     );
//   }



useEffect(() => {
    if(resident && guildEnrolled) {
        // console.log('resident', resident)
        const { residentName, avatarPic, guild: {guildFullName, guildLogo} } = resident
        getGuildChatMessages({ variables: { guildFullName }})
        const user = { _id: residentName,
                        name: residentName,
                        avatar: avatarPic}
        setUser(user)
        const index = _.findIndex(guildLogos, item => {
            
            return guildLogo == item.icon
          })
          // console.log('index',index)
          if(index >= 0) {
             const  guildImg = guildLogos[index].uri
          setGuildIcon(guildImg)
          }
        navigation.setOptions({
            headerTitle:  guildFullName,
            headerLeft: () => {
                return (
                    <Image 
                        source={guildIcon}
                        style={{width: 35, height: 35, marginLeft: 105}}
                    />
                )
            }
            
        })

    }
}, [resident, guildEnrolled])

    return (
        <View style={styles.container}>
            {guildEnrolled
            ?(
                <View style={{width: '100%', height: '100%', backgroundColor: '#FAFAFA'}}>
                    <GiftedChat
                messages={messageList}
                onSend={message => onSend(message)}
                user={user}
                alwaysShowSend
                scrollToBottom
                timeTextStyle={{ left: { color: 'red' }, right: { color: 'yellow' } }}
                infiniteScroll
                // renderBubble={renderBubble}
                
                /></View>
            
                )
            : <Text>Join a Guild</Text>}
             
                {/* onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                isTyping={this.state.isTyping}
                loadEarlier={this.state.loadEarlier}
                parsePatterns={this.parsePatterns}
                onLongPressAvatar={user => alert(JSON.stringify(user))}
                onPressAvatar={() => alert('short press')}
                onQuickReply={this.onQuickReply}
                keyboardShouldPersistTaps='never'
                renderAccessory={Platform.OS === 'web' ? null : this.renderAccessory}
                renderActions={this.renderCustomActions}
                renderBubble={this.renderBubble}
                renderSystemMessage={this.renderSystemMessage}
                renderCustomView={this.renderCustomView}
                renderSend={this.renderSend}
                quickReplyStyle={{ borderRadius: 2 }}
                renderQuickReplySend={this.renderQuickReplySend}
                inverted={Platform.OS !== 'web'} */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
        height: '100%', 
        backgroundColor: '#FAFAFA'
    }
})

export default GuildChatScreen