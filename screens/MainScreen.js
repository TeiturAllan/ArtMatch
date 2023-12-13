import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Dimensions, ScrollView, StatusBar, ImageBackground} from 'react-native';

//firebase imports
import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query  } from "firebase/firestore";

//import of components
import ImageLoaderComponent from "../components/MainScreenComponents/ImageLoaderComponent"; <ImageLoaderComponent/>
import InformationContainerComponent from "../components/MainScreenComponents/InformationContainerComponent"; <InformationContainerComponent/>


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
        //const artPieceQuery = query(collection(firebaseDB, "artPieces"), where("uploaderUID", "==", data[artistIndex].uid))
    //end of importations of methods from firebase

    const [loading, setLoading] = useState(true);
    const [artistIndex, setArtistIndex] = useState(0)
    const [artistImageIndex, setArtistImageIndex] = useState(0)

    //const [currentArtistArtPiecesQuery, setCurrentArtistArtPiecesQuery] = useState(null)
    const [artistData, setArtistData] = useState([]);
    const [artPieceData, setArtPieceData] = useState([])
    


    const win = Dimensions.get('window')
    //console.log(win.width)

    useEffect(()=> {
        fetchArtistData(artistQuery);
    }, [])

    const fetchArtistData = async(artistQuery) => {//this function fetches the data as parses/places in into the variable called "data" 
        const resp = await getDocs(artistQuery)
        dataInArray = []
        resp.forEach((doc) => {
            //console.log('documentStart')
            //console.log(doc.id, "=>", doc.data());
            docResult = doc.data()
            dataInArray.push(docResult)
        })
        setArtistData(dataInArray)
        
        await fetchArtPieceData(dataInArray, artistIndex).then(renderPage())
        //fetchArtPieceData(dataInArray[artistIndex].artPiecesUploaded[artistImageIndex])
        //renderItem(resp)//this sends the queried data to the render item function, which will eventually tell the component what to render
    }

    const fetchArtPieceData = async(artistData, artistIndex) => {//this function sets the artPieceData variable/state to an array containing all of the artwork of the active artist
        const artPieceArray = []
        q = query(collection(firebaseDB, "artPieces"), where("uploaderUID", "==", `${artistData[artistIndex].userID}`))
        console.log('fetchArtPieceData has started')
        
        const querySnapsot = await getDocs(q)
        querySnapsot.forEach((doc)=> {
            console.log('documentStart')
            docResult = doc.data()
            console.log(docResult)
            artPieceArray.push(docResult)
        })
        console.log('artPieceArray from fetch function', artPieceArray)
        setArtPieceData(artPieceArray)
        setLoading(false)
    }

    
    function renderPage(artistdata, artistIndex, artPieceData, artistImageIndex){
        //console.log('renderPage has been called')
        let props = {
            artistdata: artistdata,
            artistIndex: artistIndex,
            artPieceData: artPieceData,
            artistImageIndex: artistImageIndex,
        }
        
        return(
            <View style={styles.container}>
                <View style={styles.ImageNavigationShadowsContainer}>
                    <ImageBackground style={styles.picture} source={{uri: artPieceData[artistImageIndex].downloadURL}}>
                        <TouchableOpacity style={styles.ImageNavigationShadows}
                            onPress={() => {
                                let oldIndex = artistImageIndex
                                if (oldIndex <= 0){
                                    console.log('index is so small')
                                    return
                                } else {
                                    let newIndex = artistImageIndex - 1
                                    setArtistImageIndex(newIndex)
                                    console.log(artistImageIndex)
                                }
                        }}>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ImageNavigationShadows}
                            onPress={() => {
                                let oldIndex = artistImageIndex
                                //console.log(artistData[oldIndex].artPiecesUploaded)
                                if (oldIndex == artistData[artistIndex].artPiecesUploaded.length -1){
                                    console.log('index is so big and strong')
                                    return
                                } else {
                                    let newIndex = artistImageIndex + 1
                                    setArtistImageIndex(newIndex)
                                    console.log(artistImageIndex)
                                }
                            }}> 
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <InformationContainerComponent props={props}/>
            </View>
        )
    }

    return(
        <SafeAreaView>
            <StatusBar
            style= {hidden=false}
            />
            {loading &&  <Text style={{justifyContent: "center"}}>data is being loaded from the database</Text>}
            {!loading && renderPage(artistData, artistIndex, artPieceData, artistImageIndex)}           
        </SafeAreaView>
    )
    
}

/*{artPieceData && <ImageLoaderComponent imageDownLoadURL={artPieceData[artistImageIndex].downloadURL}/>}
            {artistData && <InformationContainerComponent props={InformationContainerComponentProps}/>}*/


//Image style={styles.picture} source={{uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Old_guitarist_chicago.jpg/270px-Old_guitarist_chicago.jpg'}}/>
const styles = StyleSheet.create({
    
    container: {
        backgroundColor: "lightblue",
        overflow: "hidden",
        width: "100%",
        height: "100%",
    },
    ImageNavigationShadowsContainer:{ 
        width: "100%",
        height: "80%",
        overflow:"hidden"
        
    },
    picture: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        flexDirection:"row"
    },
    ImageNavigationShadows:{
        width:"50%",
        height:"100%",
        

    },
    ImageNavigationButtonContainer:{
        backgroundColor: "red",
        width: "100%",
        height: "5%",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "space-around",

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
  });
export default MainScreen