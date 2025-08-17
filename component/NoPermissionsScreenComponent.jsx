import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';


const NoPermissionsScreenComponent = ( {navigation} ) => {

  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Permissions</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
  },
});

export default NoPermissionsScreenComponent;