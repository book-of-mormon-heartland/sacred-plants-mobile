import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { ThemeContext } from '.././context/ThemeContext';
var Environment = require('.././context/environment.ts');

const GeminiAIScreenComponent = ( {route} ) => {

  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const [ aiMessage, setAiMessage ] = useState("");

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  let image  = route.params.image;

  console.log("image " + image);
  console.log("image uri " + image.uri);

  const analyzeWithGeminiAI = async () => {
    console.log("make rest call");
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
        question: "1",
      });
      console.log("form data made");
      const postGeminiResponse = await fetch(serverUrl + "/rest/POST/analyzePhotoWithGemini", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: formData, // Send the JSON payload
      });
      const result = await postGeminiResponse.json();
      console.log( result.message);
      console.log( result.response);
      if(result.message == "success") {
        setAiMessage(result.response);
      } else {
        setAiMessage(result.message);
      }
    } catch (error) {
        console.log(error);
    }
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
    { aiMessage && ( 
      <View>
        <Text> 
          {aiMessage}
        </Text>
      </View>
    )};
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

export default GeminiAIScreenComponent;