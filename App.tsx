/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./context/I18nContext";
import { GoogleAuthProvider } from "./context/GoogleAuthContext";
import TabsComponent from './component/TabsComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

function App() {

  return (
    <I18nProvider>
      <GoogleAuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <TabsComponent />
          </NavigationContainer>
        </ThemeProvider>
      </GoogleAuthProvider>
    </I18nProvider>
  );
}


export default App;
