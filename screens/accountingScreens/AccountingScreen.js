import React,{} from 'react'
import { View, Text } from 'react-native'



const AccountingScreen = ({route}) => {
    const { vendor } = route.params
    return (
        <View><Text>{vendor.businessTitle}</Text></View>
    )
}

export default AccountingScreen