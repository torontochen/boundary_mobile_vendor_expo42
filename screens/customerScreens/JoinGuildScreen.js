import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Text,
  Avatar,
  Tooltip,
  Divider,
  Image,
  CheckBox,
} from "react-native-elements";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  DeviceEventEmitter
} from "react-native";
import { useQuery, useMutation } from "@apollo/react-hooks"
import _ from 'lodash'

import { guildLogos } from "../../assets/constData";
import themes from "../../assets/themes";
import {JOIN_GUILD, SET_GUILD_ENROLLED} from "../../queries/queries_mutation"
import { GET_CURRENT_RESIDENT, GET_ALL_GUILDS } from "../../queries/queries_query";

const { height, width } = Dimensions.get("window");
const cardGap = 25;
const cardWidth = (width - cardGap * 3) / 2;

const JoinGuild = ({ navigation, route }) => {
  const {guildList} = route.params
  console.log(route.params)
  console.log('guildList', guildList)
  const [guildFNSelected, setGuildFNSelected] = useState()
  const [guildSelected, setGuildSelected] = useState(null)
  // const [index, setIndex] = useState()


 
const newGuildList = guildList.map((guild) => {
  const index = _.findIndex(guildLogos, item => {
      return guild.guildLogo == item.icon
    })
    if (index >= 0) {
      return {...guild, ...{guildLogoUri: guildLogos[index].uri} }
    }
})
  
  console.log('newGuildList', newGuildList)

  const { data, loading, error } = useQuery(GET_CURRENT_RESIDENT)
  const [setGuildEnrolled] = useMutation(SET_GUILD_ENROLLED)

  const[joinGuild] = useMutation(JOIN_GUILD, {
    async update(cache, { data: { joinGuild }}) {
      const data = cache.readQuery({ query: GET_CURRENT_RESIDENT })
      data.getCurrentResident.guild = joinGuild
      setGuildEnrolled({ variables: { isEnrolled: true}})
      cache.writeQuery({ query: GET_CURRENT_RESIDENT, data})
    },
    refetchQueries: [{ query: GET_CURRENT_RESIDENT }, { query: GET_ALL_GUILDS }],
    awaitRefetchQueries: true
  })

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContainer}>
         <View 
          style={styles.subContainer}
        >
       {guildList && newGuildList.map((guild, i) => {
        //  setIndex(i)
        return (
       
        <Tooltip
          width={width * 0.5}
          height={90}
          toggleOnPress={true}
          withPointer={false}
          style={{marginHorizontal: 50}}
          popover={
            <Text style={{ color: "white" }} numberOfLines={3}>
              {guild.guildPost}
            </Text>
          }
          key={i}
          >
          <Card containerStyle={{
            borderRadius: 5,
            shadowColor: "#212121",
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 2 },
            paddingTop: 20,
            marginTop: cardGap,
            marginLeft: i % 2 !== 0 ? cardGap : 0,
            width: cardWidth,
            height: height / 3,
            backgroundColor: 'white',
            borderRadius: 16,
            shadowOpacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center'
            }} >
            <Card.Title style={{color: themes.primary}}>{guild.guildFullName}</Card.Title>

            <Card.Divider/>
            <View style={styles.infoContainer}>

                <View style={styles.subLogoContainer}>
                <Avatar
                  size = "medium"
                  source={ guild.guildLogoUri }
                />
              </View>

              <View style={styles.infoContainer}>
              <Card.FeaturedSubtitle style={{color: themes.primary}}>abbr.&nbsp;{guild.guildShortName}</Card.FeaturedSubtitle>
              </View>
            </View>

            <Card.Divider/>
                <View style={styles.infoContainer}>
                <Card.FeaturedSubtitle style={{color: themes.primary}}>members&nbsp;{guild.guildMembers.length}</Card.FeaturedSubtitle>
                
                <Card.FeaturedSubtitle style={{color: themes.primary}}>level&nbsp;{guild.guildLevel}</Card.FeaturedSubtitle>
                </View>

            <Card.Divider/>
                <View style={styles.infoContainer}>
                  <Card.FeaturedSubtitle style={{color: themes.primary}}>scores&nbsp;{guild.guildScores}</Card.FeaturedSubtitle>
                </View>

            <Card.Divider/>
                <View style={styles.infoContainer}>
                  <Card.FeaturedSubtitle style={{color: themes.primary}}>perk(day)&nbsp;{guild.perk}</Card.FeaturedSubtitle>
                  <CheckBox
                        checked={guildFNSelected == guild.guildFullName}
                        onPress={() => {
                          const newGuild = guild
                          console.log('joinGuildScreen131',guild)
                          const index = _.findIndex(guildList, item => {
                            return newGuild.guildFullName == item.guildFullName
                          })
                          console.log('index', index)
                          if (index >=0) {
                            newGuild.guildLogo = guildList[index].guildLogo
                            
                          }
                          console.log('newGuild',  newGuild)
                          setGuildSelected(newGuild)
                          setGuildFNSelected(guild.guildFullName)
                          
                        }}
                      />
                </View>
            </Card>
        </Tooltip>
        )
      })}
         </View>
     {/* <ActivityIndicator size="large" color="#B39DDB" animating={seletFlyerLoading}/>   */}
      </ScrollView> 
      <Divider></Divider>
      <View style={styles.buttonContainer}>
        <Button
          icon={{ name: "done", type: "material", color: "white" }}
          iconRight
          onPress={() => {
            const { residentName, nickName , avatarPic } = data.getCurrentResident
            joinGuild({ variables: {
              residentName,
              nickName, 
              avatar: avatarPic, 
              guildId: guildSelected._id
            }})
            console.log('joinguildscreen165', guildSelected)
            DeviceEventEmitter.emit('joinGuildEvent', {guild: guildSelected})
            navigation.goBack();
          }}
          title="Confirm"
          disabled={guildSelected == null || !data}
          disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
          buttonStyle={{
            backgroundColor: themes.primary,
            marginHorizontal: 10,
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  buttonContainer: {
    marginVertical: 10
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
  },

  scrollViewContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    height: '92%'
  },

  subLogoContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%"
  }
})



export default JoinGuild
