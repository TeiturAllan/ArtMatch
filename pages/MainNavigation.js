import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//imports from Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//import of navigation methods
const Stack = createBottomTabNavigator();
const Tab = createBottomTabNavigator();

//import of screens
import LikedNavigation from "../screens/LikedScreen"; <LikedNavigation/>
import LikedArtistScreen from "../screens/LikedArtistScreen"; <LikedArtistScreen/>
import LikedArtPieceScreen from "../screens/LikedArtPieceScreen"; <LikedArtPieceScreen/>
import MainScreen from "../screens/MainScreen"; <MainScreen/>
import MainScreenFilters from "../screens/MainScreenFilters"; <MainScreenFilters/>
import MyProfileStack from "../screens/MyProfileScreen"; <MyProfileStack/>
import SettingsScreen from "../screens/SettingsScreen"; <SettingsScreen/>




function MainNavigationPage() {
    

    return(
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Main Screen"
                component={MainScreen}
                options={{headerShown: false}}/>

                <Tab.Screen name="Liked"
                component={LikedNavigation}
                /*options={{headerShown: false}}*//>

                <Tab.Screen name="Settings"
                component={SettingsScreen}
                /*options={{headerShown: false}}*//>

                <Tab.Screen name="My Profile"
                component={MyProfileStack}
                options={{headerShown: false}}
                />
                
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigationPage