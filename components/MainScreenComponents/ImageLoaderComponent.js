import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Image, Dimensions, ImageBackground } from 'react-native';

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

/*
            const ratio = win.width/result.assets[0].height
            console.log("the image ratio is: " + ratio)
            setImageRatio(ratio)
            */

function ImageLoaderComponent({props}) {
    let artistdata = props.artistdata
    let artistIndex = props.artistIndex
    let artPieceData = props.artPieceData
    let artistImageIndex = props.artistImageIndex
   
    return(
        <View style={styles.container}>
            <ImageBackground style={styles.picture} source={{uri: artPieceData[artistImageIndex].downloadURL}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "lightblue",
        overflow: "hidden",
        width: "100%",
        height: "80%"
    },
    picture: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    }
})

export default ImageLoaderComponent