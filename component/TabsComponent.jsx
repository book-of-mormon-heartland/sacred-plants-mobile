import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from ".././context/ThemeContext";
import { GoogleAuthContext } from ".././context/GoogleAuthContext";
import ProfileScreenComponent from './ProfileScreenComponent'; // Adjust path as needed
import HomeScreenComponent from './HomeScreenComponent'; // Adjust path as needed
import SearchScreenComponent from './SearchScreenComponent'; // Adjust path as needed
import PlantStackNavigator from './PlantStackNavigator';

import {  Home, User, Search, Camera } from "react-native-feather";

const Tab = createBottomTabNavigator();

const TabsComponent = ( ) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { userToken, userProfile  } = useContext(GoogleAuthContext);
    
/*
<Tab.Screen name="Library-Main" component={BookStackNavigatorComponent} 
*/

    if (userToken?.length>0) {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Photographs" component={PlantStackNavigator}
                    options = {{
                        headerShown: false,
                        title: "Photographs",
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Camera  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
                <Tab.Screen name="Search" component={SearchScreenComponent} 
                    options = {{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Search  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />

                <Tab.Screen name="Profile" component={ProfileScreenComponent} 
                    options = {{
                        disabled: userToken?.length>0 ? true : false,
                        headerTitleAlign: 'center',
                        headerShown: true,
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarIcon: ({focused}) => (
                            <View>
                                <User stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        );
    } else {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreenComponent} 
                    options = {{
                        headerShown: true,
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Home  stroke="black" fill="#fff" width={22} height={22} />
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

export default TabsComponent;