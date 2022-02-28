import React, { useState, useEffect } from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Divider, Text, Card, Avatar } from 'react-native-elements'
import { Table, TableWrapper, Row,  Cell } from 'react-native-table-component';
import _ from 'lodash'


import { guildLogos } from "../../assets/constData";
import themes from "../../assets/themes";
const { height, width } = Dimensions.get("window");


const MyGuild = ({navigation, route}) => {
    const { guild } = route.params
    console.log('guild', guild)
    const [guildLogo, setGuildLogo] = useState()
    const element = (data, index) => (
        <TouchableOpacity onPress={() => console.log('index',index)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>manage</Text>
          </View>
        </TouchableOpacity>
      );
   const tableHead = ['name', 'alias', 'rank', 'might', 'action']
   const tableData = guild.guildMembers.map(member => {
       const rowData = []
        rowData.push(member.name)
        rowData.push(member.nickname)
        rowData.push(member.rank)
        rowData.push(member.might)
        rowData.push(member.action)
        return rowData
   })

    useEffect(() => {
        const index = _.findIndex(guildLogos, item => {
                return guild.guildLogo == item.icon
            })
            if (index >= 0) {
                setGuildLogo(guildLogos[index].uri)
            } 
    }, [guild])

   

    return (
        <View>
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.titleContainer}>
                     <Avatar 
                    source={guildLogo}
                    resizeMode='contain'
                    containerStyle={{width: 50, height: 50, marginBottom: 20}}

                /> 
                <Card.Title>&nbsp;&nbsp;&nbsp;{guild.guildFullName}&nbsp;&nbsp;({guild.guildShortName})</Card.Title>
                </View>
                
                <Card.Divider />

                <View style={styles.contentContainer}>
                    <Text>leader:&nbsp;{guild.guildLeader}</Text>
                    <Text>perk(day):&nbsp;{guild.perk}</Text>
                </View>

                <Divider />
               <View style={styles.contentContainer}>
                    <Text>members:&nbsp;{guild.guildMembers.length}</Text>
                    <Text>Score:&nbsp;{guild.guildScores}</Text>
                    <Text>treasure:&nbsp;{guild.guildSilver}</Text>
               </View>
            </Card>
            <View style={styles.tableContainer}>
                <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {
                        tableData.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                            {
                            rowData.map((cellData, cellIndex) => (
                                <Cell key={cellIndex} data={cellIndex === 4 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                            ))
                            }
                        </TableWrapper>
                        ))
                    }
                </Table>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    cardContainer: {
        width: '95%',
       margin: 10
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10
    },

    tableContainer: {  padding: 10, backgroundColor: '#fff' },

    head: { height: 40, backgroundColor: '#808B97' },

    text: { margin: 10 },

    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },

    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },

    btnText: { textAlign: 'center', color: '#fff' }

})

export default MyGuild