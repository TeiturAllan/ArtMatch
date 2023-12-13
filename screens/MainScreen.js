import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Dimensions, ScrollView} from 'react-native';

//firebase imports
import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc  } from "firebase/firestore";

//import
import ImageLoaderComponent from "../components/MainScreenComponents/ImageLoaderComponent"; <ImageLoaderComponent/>



function MainScreen() {
    const isFocused = useIsFocused();
    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        const artistQuery = query(collection(firebaseDB, "Users"), where("userIsPublic", "==", true), limit(10))
    //end of importations of methods from firebase


    const [artistIndex, setArtistIndex] = useState(0)
    const [artistImageIndex, setArtistImageIndex] = useState(0)

    const [data, setData] = useState([]);
    const [artPieceData, setArtPieceData] = useState(null)
    const [loading, setLoading] = useState(true);


    const win = Dimensions.get('window')
    //console.log(win.width)

    const fetchArtistData = async() => {//this function fetches the data as parses/places in into the variable called "data" 
        const resp = await getDocs(artistQuery)
        dataInArray = []
        resp.forEach((doc) => {
            console.log('documentStart')
            //console.log(doc.id, "=>", doc.data());
            docResult = doc.data()
            dataInArray.push(docResult)
        })
        console.log(dataInArray)
        setData(dataInArray)
        setLoading(false)
        fetchArtPieceData(dataInArray[artistIndex].artPiecesUploaded[artistImageIndex])
        //renderItem(resp)//this sends the queried data to the render item function, which will eventually tell the component what to render
    }

    const fetchArtPieceData = async(documentPath) => {
        console.log('fetchArtPieceData has started')
        console.log(documentPath)
        const artPieceDocRef = doc(firebaseDB,"artPieces", `${documentPath}`)
        const docSnap = await getDoc(artPieceDocRef)
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setArtPieceData(docSnap.data())
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        
    }



    const renderItem = (artistData, artPieceData) => { //this function renders what will be shown after the data has been returned from the database
        //fetchArtPieceData(dataInArray[0].artPiecesUploaded[artistImageIndex])
        return(
            <View style={[styles.container, {backgroundColor : "yellow"}]}>
                
                    <View style={styles.artPieceInfoContainer}>
                        <View style={styles.artistNameContainer}>
                            <Text style={styles.artistName}>{artistData[artistIndex].artistName} </Text>
                        </View>
                        <View>
                            <Text>art piece name: {artPieceData.artPieceTitle}</Text>
                            <Text>Dimensions: {artPieceData.dimensions.height}cm x {artPieceData.dimensions.length}cm </Text>
                        </View>
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

    useEffect(()=> {
        fetchArtistData();
    }, [])
    if(isFocused === true){
        return(
            <View style={styles.container}>
                {artPieceData && <ImageLoaderComponent imageDownLoadURL={artPieceData.downloadURL} />}
                {loading && <Text> Loading, still loading </Text>}
                {artPieceData && renderItem(data, artPieceData)}
                
            </View>
        )
    } else {
        return(
            <View style={styles.container}>
                <Text>Something went wrong</Text>
                
            </View>
        )
    }
    
}
//Image style={styles.picture} source={{uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Old_guitarist_chicago.jpg/270px-Old_guitarist_chicago.jpg'}}/>
const styles = StyleSheet.create({
    container: {
        backgroundColor: "lightblue",
        overflow: "hidden",
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
                },

TopButtonContainer:{
    width: '100%',
    flexDirection: "row"
    },
        editProfileButton: {
            backgroundColor: '#0a5da6',
            width: '50%',
            padding: 5,
            marginBottom: 15,
            borderRadius: 10,
            alignItems: 'center'
        },
        LogOutButton: {
            backgroundColor: '#0a5da6',
            width: '50%',
            padding: 5,
            marginBottom: 15,
            borderRadius: 10,
            alignItems: 'center'
          },
  });
export default MainScreen