import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { useI18n } from '.././context/I18nContext'; 
import { getLocales } from 'react-native-localize';


import { Platform } from 'react-native';

const LoginScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut } = useContext(GoogleAuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  const { language, setLanguage, translate } = useI18n();

  /*
  const selectLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  }
  */
  const locales = getLocales();
  const primaryLocale = locales[0];
  setLanguage(primaryLocale.languageCode);
  //console.log('Detected Language Code:', primaryLocale.languageCode); 
  //console.log('Detected Language Tag:', primaryLocale.languageTag); 


  return (
    <View style={styles.loginContainer}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{translate('greeting')}</Text>
      <Image source={require('.././assets/sacred-plants-200x200.png')} style={styles.loginScreenImage} />
      <TouchableOpacity style={styles.googleButton} onPress={signIn }>
        <Image
          source={require('.././assets/google-sign-in.png')} // Replace with your Google logo image path
          style={styles.logo}
        />
        <Text style={styles.googleButtonText}>{translate('google_login')}</Text>
      </TouchableOpacity>
     </View>
  );
};


const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginScreenImage: {
    padding: 20,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row', // Arranges children horizontally
    justifyContent: 'space-around', // Distributes space evenly
    alignItems: 'center', // Aligns items vertically in the center
    padding: 10,
  },
  belowImageButton: {
    backgroundColor: '#007bff', 
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
  button: {
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // White background for the button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  googleButtonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreenComponent;