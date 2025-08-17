import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';



const GoogleMapScreenComponent = ( {route} ) => {

  const mapRef = useRef(null);
  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage, userToken } = useContext(GoogleAuthContext);
  let latitude  = route.params.latitude;
  let longitude  = route.params.longitude;
  //let latitude = 32.2540;
  //let longitude = -110.9742;
  //latitude = photolatitude;
  //longitude= photolongitude;


  let myRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [region, setRegion] = useState(myRegion);
  let markerCoordinate = {
      latitude: latitude,
      longitude: longitude,
  };


  useEffect(() => {
    //zoomIn()
    let latestRegion = {
      latitude: route.params.latitude,
      longitude: route.params.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    mapRef.current?.animateToRegion(latestRegion, 200);
  }, []); 

  let description = "Latitude: " + latitude + " Longitude: " + longitude;


  const zoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.8, // Adjust zoom factor as needed
      longitudeDelta: region.longitudeDelta * 0.8,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200); // Animate over 200ms
    };

  const zoomOut = () => {
    
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 1.2, // Adjust zoom factor as needed
      longitudeDelta: region.longitudeDelta * 1.2,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200);
    
  };


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={myRegion}
        provider={PROVIDER_GOOGLE}
        //onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Keep state updated on user interaction
      >

        <Marker
            coordinate={markerCoordinate}
            title={"Image"}
            description={description}
        />
      
      </MapView>
      <View style={styles.controls}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 10,
  },
});

export default GoogleMapScreenComponent;


/*
        mapRef.current.animateToRegion({
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
          latitudeDelta: newLatitudeDelta,
          longitudeDelta: newLongitudeDelta,
        }, 500); // 500ms a
        */