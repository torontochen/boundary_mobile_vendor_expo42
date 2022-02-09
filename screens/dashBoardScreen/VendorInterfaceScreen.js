import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { Tab, TabView, Overlay } from 'react-native-elements'
import { useQuery } from '@apollo/react-hooks'

import { GET_VENDOR_INTERFACE } from '../../queries/queries_query'
import Showcase  from '../../components/Showcase'


const VendorInterfaceScreen = ({ navigation, route }) => {
    const { vendor } = route.params

    const [vendorInterfaceData, setVendorInterfaceData] = useState(null)
    const [index, setIndex] = useState(0)
    const [isInterfaceOverlayVisible, setIsInterfaceOverlayVisible] = useState()

    const { data, loading, error } = useQuery(GET_VENDOR_INTERFACE, { 
        variables: { vendor },
        fetchPolicy: 'cache-and-network'
    })

    useEffect(() => {
        if(data) {
            console.log('loading', loading)
            setIsInterfaceOverlayVisible(loading)
            setVendorInterfaceData(data.getVendorInterface)
            console.log('vendorInterface',data.getVendorInterface)
        }
    }, [data, loading, error])

    return ( 
     <>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                backgroundColor: 'white',
                height: 3,
                }}
                variant="primary"
                disableIndicator={true}
            >
                <Tab.Item
                title="Showcase"
                titleStyle={{ fontSize: 8 }}
                style={{ marginTop: 6 }}
                icon={{ name: 'store', type: 'font-awesome-5', color: 'white' }}
                />
                <Tab.Item
                title="Events"
                titleStyle={{ fontSize: 8 }}
                icon={{ name:'calendar-alt', type: 'font-awesome-5', color: 'white' }}
                style={{ marginTop: 6 }}
                />
                <Tab.Item
                title="Customer"
                titleStyle={{ fontSize: 8 }}
                style={{ marginTop: 6 }}
                icon={{ name: 'people-arrows', type: 'font-awesome-5', color: 'white' }}
                />
                <Tab.Item
                title="Info"
                style={{ marginTop: 6 }}
                titleStyle={{ fontSize: 8 }}
                icon={{ name: 'file-alt', type: 'font-awesome-5', color: 'white' }}
                />
            </Tab>

 
            <TabView value={index} onChange={setIndex} animationType='timing'>
               
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }} onMoveShouldSetResponder={(e) => e.stopPropagation()}>
                 {vendorInterfaceData&& <Showcase itemCatalog={vendorInterfaceData.itemCatalog} navigation={navigation}  vendor={{
                                                                                                                                logo: vendorInterfaceData.logo, 
                                                                                                                                vendor: vendorInterfaceData.businessTitle,
                                                                                                                                vendorId: vendorInterfaceData._id }}/>}   
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                <Text h1>Favorite</Text>
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                <Text h1>Favorite</Text>
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'green', width: '100%' }}>
                <Text h1>Cart</Text>
                </TabView.Item>

            </TabView>     
                
             {/* vendor interface loading overlay */}
                <Overlay
                visible={isInterfaceOverlayVisible}
                >
                <ActivityIndicator
                    color="#0000ff"
                    size='large'
                />
                </Overlay>
        </>
    
       

    )
}

export default VendorInterfaceScreen