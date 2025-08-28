import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useI18n } from '.././context/I18nContext'; 



const SettingsScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signOut, jwtToken } = useContext(GoogleAuthContext);
  const [loading, setLoading] = useState(false);
  
  const isIOS = ( Platform.OS === 'ios' );
  const { language, setLanguage, translate } = useI18n();

  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const  setLanguageEndpoint = serverUrl + "/rest/POST/setLanguage"; // Example endpoint

  const saveLanguage = async (selectedLanguage) => {
    console.log("Attempting to save language preference to server: " + language);
    setLoading(true);    
    try {
      const response = await fetch(setLanguageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });
      if (!response.ok) {
        console.log("response was not okay")
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      //setData(json);
    } catch (error) {
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectLanguage = (selectedLanguage) => {
    console.log("in select language");

    setLanguage(selectedLanguage);
    console.log("want to save the language");
    saveLanguage(selectedLanguage);
  }


  return (
    <View>
      <>
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>{translate('signed_in')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'#3FDD57FF'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={signOut}
          value={false}
        />
      </View>
      </>
      <>
    <View style={{ height: 200, justifyContent: 'top' }}>
      <View style={styles.pickerContainer}>
      <Text style={styles.settingTitle}>{translate('select_language')}</Text>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => selectLanguage(itemValue)}
          style={styles.picker}
        >
            <Picker.Item
              key={"en"}
              label={"English"}
              value={"en"}
            />
            <Picker.Item
              key={"es"}
              label={"Spanish"}
              value={"es"}
            />
 
        </Picker>
      </View>
    </View>
      </>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingTitle: {
    paddingTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderColor: '#ccc',
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SettingsScreenComponent;