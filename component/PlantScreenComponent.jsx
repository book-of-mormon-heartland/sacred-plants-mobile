import React, { useState, useEffect, useContext, Component } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import CameraScreenComponent from './CameraScreenComponent.jsx';
import GoogleMapScreenComponent from './GoogleMapScreenComponent.jsx';

const PlantScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isIOS = ( Platform.OS === 'ios' );
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {

  
  }, []); // Empty dependency array means this runs once on mount


  const analyzeWithGoogleVision = () => {
    console.log("Analyze Image with Google Vision");
    console.log(selectedImage.uri);
    navigation.navigate('Vision', {
      image: selectedImage,
    });
  }
  
  const analyzeWithGeminiAI = () => {
    navigation.navigate('GeminiAI', {
      image: selectedImage,
    });
  }

  const analyzeLocation = async() => {
    console.log("Analyze Location");
    console.log("This is the image");
    console.log(selectedImage.uri);
    Image.getSize(
      selectedImage.uri, (width, height) => {
        console.log('Image dimensions:', { width, height });
      },
      (error) => {
        console.error('Failed to get image size:', error);
      }
    );
    try {
      const fileUri = selectedImage.uri;
      const url = new URL(fileUri);
      let urlString = url.toString();
      if(urlString.endsWith("/")) {
        urlString = urlString.slice(0, -1);
      }
      let indexOfValue = urlString.lastIndexOf('/');
      const fileName = urlString.substring(indexOfValue + 1);
      const fileType = 'image/jpeg';

      const formData = new FormData();
      formData.append('myFile', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      }); // Type assertion is sometimes needed for fetch

      const response = await fetch('http://192.168.1.171:3001/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Success', data.message);
        console.log('Latitude', data.latitude);
        console.log('Longitude', data.longitude);
        navigation.navigate('GoogleMap', {
          latitude: data.latitude,
          longitude: data.longitude,
        });
        
      } else {
        console.log('Error', data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setSelectedImage(source);
      }
    });
  }



  const takePicture = () => {
    navigation.navigate('Camera');

  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Obtain Plant Image</Text>


      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={selectImage} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Select Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.subtitle}>Selected Image:</Text>
          <Image source={selectedImage} style={styles.image} />
           <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.belowImageButton} onPress={analyzeWithGoogleVision} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Google Vision</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.belowImageButton} onPress={analyzeWithGeminiAI} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Gemini AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.belowImageButton} onPress={analyzeLocation} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Location</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}


    </SafeAreaView>
  );
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row', // Arranges children horizontally
    justifyContent: 'space-around', // Distributes space evenly
    alignItems: 'center', // Aligns items vertically in the center
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 0,
    marginTop: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 5,
  },
  imageContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginTop: 10,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#007bff', // Blue background
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginTop: 0,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  belowImageButton: {
    backgroundColor: '#007bff', // Blue background
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 0,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },

});


export default PlantScreenComponent;