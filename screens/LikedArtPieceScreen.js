import React from "react";
import { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Dimensions, ScrollView, StatusBar, ImageBackground} from 'react-native';

import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query, updateDoc, arrayUnion  } from "firebase/firestore";


function LikedArtistScreen() {
    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        const likedArtPiecesQuery = query(collection(firebaseDB, "artPieces"), where("likedBy", "array_contains", `${user.uid}`))
        //const artPieceQuery = query(collection(firebaseDB, "artPieces"), where("uploaderUID", "==", data[artistIndex].uid))
    //end of importations of methods from firebase


    //states used for this page
    const [loading, setLoading] = useState(true);//this variable is used to indicate when the needed data has been fetched from the firestore database. when this variable is set to false, then the page will load
    const [likedArtPiecesData, setLikedArtPiecesData] = useState([])



    useEffect(()=> {//this function fires as soon as the page starts. it starts the sequence that is needed for the page to load properly
        fetchLikedArtists();
    }, [])

    const fetchLikedArtists = async() => {
        likedArtistArray = []
        
        const likedArtPiecesQuery = query(collection(firebaseDB, "artPieces"), where("likedBy", "array-contains", `${user.uid}`))
        const databaseResponse = await getDocs(likedArtPiecesQuery)
        databaseResponse.forEach((doc)=> {
            //console.log('documentStart')
            docResult = doc.data()
            //console.log(docResult)
            likedArtistArray.push(docResult)
        })
        setLikedArtPiecesData(likedArtistArray)
        setLoading(false)
    }

    function renderPage(artPieceArray){
        console.log('renderPage has started')
        console.log(artPieceArray)
        return(
            <SafeAreaView>
                {artPieceArray.map((item, index)=> (
                    <View style={styles.likedArtistContainer} key={index}>
                    <TouchableOpacity  style={styles.ArtistsProfilePicFrame}>
                            <Image source={{uri: item.downloadURL}} style={styles.ProfilePic} />
                    </TouchableOpacity>
                    <View style={styles.artistsTextContainer}> 
                        <Text>{item.artPieceTitle} </Text>
                        <Text>{item.dimensions.height}cm x {item.dimensions.length}  </Text>
                        <Text>{item.customText} </Text>
                    </View>
                </View>
                ))}
            </SafeAreaView>
        )
    }

        return(//this return function is the actual loading of the page
        <ScrollView>
            <StatusBar style={hidden=false}/>
            {loading &&  <Text style={{justifyContent: "center"}}>data is being loaded from the database</Text>}
            {!loading && renderPage(likedArtPiecesData)}          
        </ScrollView>//the renderPage function fires as soon as the loading variable is set to false. the renderPage actually contains all of the main page functionality
    )
}

const styles = StyleSheet.create({
    likedArtistContainer:{
        width: "100%", 
        backgroundColor: "lightgrey",
        flexDirection: "row",
        marginVertical: 3,
    },
        ArtistsProfilePicFrame:{
            width: "40%",
                height: 150,
                overflow:"hidden",
                backgroundColor: "lightblue"
        },
            ProfilePic:{
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                resizeMode: "contain" 
            },
            artistsTextContainer:{
                width: "60%",
                backgroundColor: "white",
                
            }
  });
export default LikedArtistScreen