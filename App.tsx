/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleAuthProvider } from "./context/GoogleAuthContext";
import TabsComponent from './component/TabsComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

function App() {

  return (
    <GoogleAuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <TabsComponent />
        </NavigationContainer>
      </ThemeProvider>
    </GoogleAuthProvider>
  );
}


export default App;
