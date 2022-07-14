import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Camera } from 'expo-camera';

const QrCodeScanner = (props) => {

  const { setQrInfo, setIsQrScannerVisible, isQrScannerVisible } = props

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  // const [type, setType] = useState(Camera.Constants.Type.back);

  

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // const { status } = await Camera.requestCameraPermissionsAsync();

      console.log('status', status)
      setHasPermission(status === 'granted');
    })()
  }

 

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    setQrInfo(data)
    setIsQrScannerVisible(!isQrScannerVisible)
    console.log('Type: ' + type + '\nData: ' + data)
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
          {/* <Camera
          onBarCodeScanned={(...args) => {
            const data = args[0].data;
            const result = JSON.stringify(data);
            console.log(result);
          }}
          barCodeScannerSettings={{
            barCodeTypes: ['qr'],
          }}
          style={{ height: 400, width: 400  }}
        /> */}
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {/* {scanned &&  */}
      <Button 
      title='Scan Customer Info' 
      onPress={() => {
        const qrInfo = {
          customerName: 'chenhaoyujcgmail',
          customerFullName: 'Jack Chen'
        }
        setQrInfo(qrInfo)
        setIsQrScannerVisible(!isQrScannerVisible)
        // setScanned(false)
      }} 
      color='tomato'  
      containerStyle={styles.button}
      />
      {/*  */}
      <Button 
      title='Scan Combo Coupon' 
      onPress={()=>{
        const qrInfo = {
          customerName: 'chenhaoyujcgmail',
          customerFullName: 'Jack Chen',
          flyerId: 'wish_COUPON_March 11th 2022, 10:00:05 am',
          couponId: 'My Flyer_1632533020189',
          vendor: 'wish',
          valueType: 'COMBO_CASH_VALUE',
          couponTitle: 'pizza combo',
          flyerTitle: 'My Flyer'
        }
        setQrInfo(qrInfo)
        setIsQrScannerVisible(!isQrScannerVisible)
      }} 
      containerStyle={styles.button}
      />
      <Button 
      title='Scan Silver' 
      onPress={()=>{
        const qrInfo = {
          customerName: 'chenhaoyujcgmail',
          silver: 30
        }
        setQrInfo(qrInfo)
        setIsQrScannerVisible(!isQrScannerVisible)
      }} 
      containerStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '90%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: 250,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
  button: {
    width: '65%', 
    marginVertical: 20
  }
});

export default QrCodeScanner