import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { GoogleSigninButton, GoogleSignoutButton } from '@react-native-google-signin/google-signin';

import { Platform } from 'react-native';

const LoginScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut } = useContext(GoogleAuthContext);
  const isIOS = ( Platform.OS === 'ios' );

  return (
    <View style={styles.loginContainer}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Welcome to Sacred Plants</Text>
      <Image source={require('.././assets/sacred-plants-200x200.png')} style={styles.loginScreenImage} />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={ signIn }
        disabled={false}
      />
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
});

export default LoginScreenComponent;