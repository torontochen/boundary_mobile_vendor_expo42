import React, {useState} from 'react'
import { View, StyleSheet, FlatList, SafeAreaView, Dimensions, DeviceEventEmitter } from 'react-native'
import { Input, Card, CheckBox, Divider, Button} from 'react-native-elements'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

import { guildLogos } from "../../assets/constData";
import themes from "../../assets/themes";
import { CHECK_GUILD_NAME, GET_CURRENT_RESIDENT, GET_ALL_GUILDS } from "../../queries/queries_query"
import { START_GUILD } from "../../queries/queries_mutation"

const { height, width } = Dimensions.get("window");
const cardGap = 8;
const cardWidth = (width - cardGap * 3) / 4;

const StartGuild = ({navigation}) => {

    const [guildFullName, setGuildFullName] = useState()
    const [guildShortName, setGuildShortName] = useState()
    const [guildPost,setGuildPost] = useState()
    const [guildLogo, setGuildLogo] = useState()
    const [inputErrMsg, setInputErrMsg] = useState()

    const { data: residentData, loading:residentLoading, error } = useQuery(GET_CURRENT_RESIDENT)

    const [startGuild] = useMutation(START_GUILD, {
        async update(cache, { data: { startGuild }}) {
            const data = cache.readQuery({ query: GET_CURRENT_RESIDENT})
            data.getCurrentResident.guild = startGuild
            data.getCurrentResident.guildOwned = startGuild._id
            cache.writeQuery({ query: GET_CURRENT_RESIDENT, data})
        },
        refetchQueries: [{ query: GET_CURRENT_RESIDENT }, { query: GET_ALL_GUILDS }],
        awaitRefetchQueries: true
    })


    const [checkGuildName] = useLazyQuery(CHECK_GUILD_NAME, {
        async onCompleted({ checkGuildName }) {
          const { guildNameIsOk } = checkGuildName;
          if (!guildNameIsOk) {
            setInputErrMsg("This Resident Name In Use");
          }
        },
        fetchPolicy: "cache-and-network",
      });

    const renderItem = ({ item }) => (
        <Card containerStyle={styles.card}>
            <Card.Image 
             source={item.uri}
             resizeMode='contain'
            />
            <Card.Divider />
            <CheckBox
                style={{alignSelf: 'center'}}
                checked={guildLogo == item.icon}
                onPress={() => {
                    setGuildLogo(item.icon)
                }}
            />
        </Card>
      );

    return (
        // <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeAreaView}>
                <Input 
                    placeholder="guild full name"
                    onChangeText={(text) => {
                    setInputErrMsg("");
                    setGuildFullName(text);
                    checkGuildName({ variables: { guildName: text, nameType: 'fullName' } });
                    }}
                    inputStyle={styles.input}
                    placeholderTextColor="#BDBDBD"
                    errorStyle={{ color: "red" }}
                    errorMessage={inputErrMsg}
                    label="Guild Full Name"
                    autoCapitalize="none"
                />
                <Input 
                    placeholder="guild short name"
                    onChangeText={(text) => {
                    setInputErrMsg("");
                    setGuildShortName(text);
                    checkGuildName({ variables: { guildName: text, nameType: 'shortName' } });
                    }}
                    inputStyle={styles.input}
                    placeholderTextColor="#BDBDBD"
                    errorStyle={{ color: "red" }}
                    errorMessage={inputErrMsg}
                    label="Guild Short Name"
                    autoCapitalize="none"
                />

                <FlatList
                    data={guildLogos}
                    renderItem={renderItem}
                    keyExtractor={item => item.icon} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <Input
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={(text) => setGuildPost(text)}
                    value={guildPost}
                    label='Post'
                    style={{ height:100, textAlignVertical: 'top',}} 
                />
                <Divider />
                <View style={styles.buttonContainer}>
                    <Button
                    icon={{ name: "done", type: "material", color: "white" }}
                    iconRight
                    onPress={() => {
                        const { residentName, nickName , avatarPic } = residentData.getCurrentResident
                        startGuild({ variables: {
                                                guildLeader: residentName,
                                                guildLeaderAvatar: avatarPic,
                                                guildLeaderNickName: nickName,
                                                guildFullName,
                                                guildShortName,
                                                guildLogo,
                                                guildPost
                                                }})
                        DeviceEventEmitter.emit('joinGuildEvent', {guild: { guildLogo }})
                        navigation.goBack();
                    }}
                    title="Confirm"
                    disabled={!guildFullName||!guildShortName||!guildLogo||!residentData}
                    disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                    buttonStyle={{
                        backgroundColor: themes.primary,
                        marginHorizontal: 10,
                    }}
                    />
                </View>

            </SafeAreaView>
        // </View>
    )

}

const styles = StyleSheet.create({
    
    buttonContainer: {
        marginVertical: 5,
        width: '90%'
      },

    card: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: cardWidth,
        height: height / 4,
        padding: -50
    },

    input: {
        color: themes.primary,
        marginVertical: 5,
        zIndex: -1,
    },

    safeAreaView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flex: 1,
        margin: 15
    }
})

export default StartGuild