import React, { useState, useEffect, useContext, Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import CameraScreenComponent from './CameraScreenComponent.jsx';
import Markdown from 'react-native-markdown-display';
import { useI18n } from '.././context/I18nContext'; 


const Plant2ScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [ aiMessage, setAiMessage ] = useState("");
  const { language, setLanguage, translate } = useI18n();
  
  
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }


  useEffect(() => {

  
  }, []); // Empty dependency array means this runs once on mount


  const analyzeWithGoogleVision = () => {
    console.log("Analyze Image with Google Vision");
    console.log(selectedImage.uri);
    navigation.navigate('Vision', {
      image: selectedImage,
    });
  }
  
  const analyzeWithGeminiAI = async() => {
    setLoading(true);
    setAiMessage("");
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
        question: "1",
      });
      const postGeminiResponse = await fetch(serverUrl + "/rest/POST/analyzePhotoWithGemini", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: formData, // Send the JSON payload
      });
      const result = await postGeminiResponse.json();
      //console.log( result.message);
      //console.log( result.response);
      if(result.message == "success") {
        setAiMessage(result.response);
        setLoading(false);
      } else {
        setAiMessage(result.message);
        setLoading(false);
      }
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
  }

  const analyzeLocation = async() => {
    setAiMessage("");

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
    setAiMessage("");

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
    <ScrollView style={styles.scrollContainer}>
      <View  style={styles.container}>
      <Text style={styles.title}>{translate('obtain_plant_image')}</Text>
      {loading ? (
        <View style={styles.imageContainer}></View>
      ) : (
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={selectImage} activeOpacity={0.7}>
              <Text style={styles.buttonText}>{translate('select_photo')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture} activeOpacity={0.7}>
              <Text style={styles.buttonText}>{translate('open_camera')}</Text>
            </TouchableOpacity>
        </View>
      )}
      </View>
    {selectedImage ? (
      <View style={styles.imageContainer}>
        <Text style={styles.subtitle}>{translate('selected_image')}</Text>
        <Image source={selectedImage} style={styles.image} />
        {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>{translate('loading_data')}...</Text>
            </View>
        ) : (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.belowImageButton} onPress={analyzeWithGeminiAI} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>{translate('analyze_with_gemini_ai')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.belowImageButton} onPress={analyzeLocation} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>{translate('location')}</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>
    ) : null }
    {aiMessage ? (
      <View style={styles.aiView}>
        <Markdown style={styles.aiText}> 
          {aiMessage}
        </Markdown>
      </View>
    ) : null}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
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
  aiView: {
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  aiText: {
    padding: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },

});


export default Plant2ScreenComponent;
