import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { ThemeContext } from '.././context/ThemeContext';
var Environment = require('.././context/environment.ts');

const GeminiAIScreenComponent = ( {route} ) => {

  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  let image  = route.params.image;

  console.log("image " + image);
  console.log("image uri " + image.uri);

  const analyzeWithGeminiAI = async() => {
    console.log("make rest call");
    const fetchData = async () => {
      try {
        console.log("inside try");
        const fileUri = image.uri;
        const url = new URL(fileUri);
        let urlString = url.toString();
        if(urlString.endsWith("/")) {
          urlString = urlString.slice(0, -1);
        }

        console.log("Server URL " + serverUrl);
        let indexOfValue = urlString.lastIndexOf('/');
        const fileName = urlString.substring(indexOfValue + 1);
        const fileType = 'image/jpeg';
        const formData = new FormData();
        formData.append('myFile', {
          uri: fileUri,
          name: fileName,
          type: fileType,
          question: 1
        }); // Type assertion is sometimes needed for fetch
        console.log("About to make fetch");
        const postResponse = await fetch(serverUrl + "/rest/POST/analyzePhotoWithGemini", {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jwtToken}`
          },
        });
        const responseData = await postResponse.json();
        console.log(responseData.message);

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  };

  
  return (
    <View style={styles.container} >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <View>
        <TouchableOpacity style={styles.belowImageButton} onPress={analyzeWithGeminiAI} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Analyze with AI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'top',
    alignItems: 'center',
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
});

export default GeminiAIScreenComponent;