import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

/*
            const ratio = win.width/result.assets[0].height
            console.log("the image ratio is: " + ratio)
            setImageRatio(ratio)
            */

function ImageLoaderComponent({imageDownLoadURL}) {
    const [imageRatio, setImageRatio] = useState(null)
    win = Dimensions.get('window')
            
    return(
        <View style={styles.container}>
            <Image style={styles.picture} source={{uri: imageDownLoadURL}}/>
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