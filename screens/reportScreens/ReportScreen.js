import React, {} from 'react'
import { View, Text }  from 'react-native'

const ReportSceen = ({ route }) => {
     const { vendor } = route.params

     return (
         <>
         <Text>{vendor.businessTitle}</Text>
          </>
     )
}

export default ReportSceen