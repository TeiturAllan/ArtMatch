import React from "react";
import { useState } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View } from 'react-native';

import LikedArtistScreen from "./LikedArtistScreen"; <LikedArtistScreen/>
import LikedArtPieceScreen from "./LikedArtPieceScreen"; <LikedArtPieceScreen/>

const Tab = createMaterialTopTabNavigator();

function LikedNavigation() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Artists" component={LikedArtistScreen} />
        <Tab.Screen name="Art Pieces" component={LikedArtPieceScreen} />
      </Tab.Navigator>
    );
  }

export default LikedNavigation