import React from "react";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';

/*
            const ratio = win.width/result.assets[0].height
            console.log("the image ratio is: " + ratio)
            setImageRatio(ratio)
            */

function InformationContainerComponent({props}) {
    //the next four lines are are used to "unpack" the props variable as the following code will be hard to read if everything includes "props.variable"
    let artistdata = props.artistdata
    let artistIndex = props.artistIndex
    let artPieceData = props.artPieceData
    let artistImageIndex = props.artistImageIndex
    
    
    return(
            <View style={[styles.container, {backgroundColor : "yellow"}]}>  
                    <View style={styles.artPieceInfoContainer}>
                        <View style={styles.artistNameContainer}>
                            <Text style={styles.artistName}>{artistdata[artistIndex].artistName} </Text>
                        </View>
                        <View>
                            <Text>art piece name: {artPieceData[artistImageIndex].artPieceTitle}</Text>
                            <Text>Dimensions: {artPieceData[artistImageIndex].dimensions.height}cm x {artPieceData[artistImageIndex].dimensions.length}cm </Text>
                        </View>

                        <Text>these buttons will probably be moved, so that they are on the other page</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text>Dislike Artist</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text>Like Art Piece</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text>Like Artist</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "lightblue",
        overflow: "scrollable",
        width: "100%",
        height: "100%",
    },
        artPieceInfoContainer: {
            width: "100%",
            height: "20%",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            
            
        },
            artistNameContainer: {
                height: "15%",
                width: "100%",
                
            },
                artistName:{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "green",
                    textAlign: "center",
                    textAlignVertical: "center"
                },
            artPieceInfo: {
                width: "100%",
                height: "60%",
                backgroundColor: "yellow",
            },
            buttonContainer:{
                backgroundColor: "red",
                width: "100%",
                height: "20%",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "space-around",
                alignSelf: "flex-end",
                position: "absolute",
                bottom: 0
            },
                button:{
                    backgroundColor: '#0a5da6',
                    width: '30%',
                    padding: 5,
                    marginBottom: 5,
                    borderRadius: 10,
                    alignItems: 'center'
                }
})

export default InformationContainerComponent