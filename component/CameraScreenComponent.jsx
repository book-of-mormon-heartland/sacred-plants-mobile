import React, { useState, useEffect, useContext, Component } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import NoPermissionsScreenComponent from './NoPermissionsScreenComponent.jsx';
import NoCameraScreenComponent from './NoCameraScreenComponent.jsx';

const CameraScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const isIOS = ( Platform.OS === 'ios' );
  const navigation = useNavigation();

  useEffect(() => {
    requestPermissions();
  }, []); 
  
  const requestPermissions = async () => {
    const cameraPermission = Camera.getCameraPermissionStatus()
    const microphonePermission = Camera.getMicrophonePermissionStatus()
    if(cameraPermission != "granted") {
      await Camera.requestCameraPermission()
    }
    if(microphonePermission != 'granted') {
      await Camera.requestMicrophonePermission()
    }
  }

  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const devices = Camera.getAvailableCameraDevices()
  console.log("These are the devices");
  console.log(devices);

  if (!hasPermission) return <NoPermissionsScreenComponent />
  if (device == null) return <NoCameraScreenComponent />
  return (
    <View style={styles.container}>
      <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
          />
    </View>
  );
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

});


export default CameraScreenComponent;