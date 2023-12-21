import React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Dimensions, ScrollView, StatusBar, ImageBackground, Alert} from 'react-native';

//firebase imports
import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query, updateDoc, arrayUnion, setDoc, addDoc  } from "firebase/firestore";

//import of components
import ImageLoaderComponent from "../components/MainScreenComponents/ImageLoaderComponent"; <ImageLoaderComponent/>//this component is currently not used
import InformationContainerComponent from "../components/MainScreenComponents/InformationContainerComponent"; <InformationContainerComponent/>//this component is currently not used 


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

    const [loading, setLoading] = useState(true);//this variable is used to indicate when the needed data has been fetched from the firestore database. when this variable is set to false, then the page will load
    const [artistIndex, setArtistIndex] = useState(0)
    const [artistImageIndex, setArtistImageIndex] = useState(0)

    //const [currentArtistArtPiecesQuery, setCurrentArtistArtPiecesQuery] = useState(null)
    const [artistData, setArtistData] = useState([]);
    const [artPieceData, setArtPieceData] = useState([])
    const [activeArtPieceForSaleStatus, setActiveArtPieceForSaleStatus] = useState(true)


    const win = Dimensions.get('window')
    //console.log(win.width)

    useEffect(()=> {//this function fires as soon as the page starts. it starts the sequence that is needed for the page to load properly
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

    const fetchArtPieceData = async(artistDataToFetch, artistIndexToFetch) => {//this function sets the artPieceData variable/state to an array containing all of the artwork of the active artist
        const artPieceArray = []
        q = query(collection(firebaseDB, "artPieces"), where("uploaderUID", "==", `${artistDataToFetch[artistIndexToFetch].userID}`)) //this gives the typeError "cannot convert undefined value to object". i do not know how to fix this error as the I am using the method provided in the firestore docs
        const querySnapsot = await getDocs(q)
        querySnapsot.forEach((doc)=> {
            //console.log('documentStart')
            docResult = doc.data()
            //console.log(docResult)
            artPieceArray.push(docResult)
        })
        setArtPieceData(artPieceArray)
        setLoading(false)
        setActiveArtPieceForSaleStatus(artPieceArray[0].forSale)
    }


    
    function renderPage(artistdata, artistIndex, artPieceData, artistImageIndex){
        
        //console.log('renderPage has been called')        
        return(
            <View style={styles.container}>
                <View style={styles.ImageNavigationShadowsContainer}>
                    <ImageBackground style={styles.picture} resizeMode="contain"source={{uri: artPieceData[artistImageIndex].downloadURL}}>
                        <TouchableOpacity style={styles.ImageNavigationShadows}
                            onPress={() => {
                                let oldIndex = artistImageIndex
                                if (oldIndex <= 0){
                                    console.log('index is so small')
                                    return
                                } else {
                                    let newIndex = artistImageIndex - 1
                                    setArtistImageIndex(newIndex)
                                    setActiveArtPieceForSaleStatus(artPieceData[newIndex].forSale)
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
                                    setActiveArtPieceForSaleStatus(artPieceData[newIndex].forSale)
                                }
                            }}> 
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={[styles.nonImageContainer]}>  
                    <View style={styles.buttonContainer}>
                        <View style={styles.likeButtonContainer}>
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                                dislikeArtist(artistdata[artistIndex].userID)
                            }}>
                                <Text>Dislike Artist</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={()=> {
                                likeArtPiece(artPieceData[artistImageIndex], artistdata[artistIndex].userID)
                                console.log('you have pressed the "like art piece button"')
                            }}>
                                <Text>Like Art Piece</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                likeArtist(artistdata[artistIndex].userID)
                            }}>
                                <Text>Like Artist</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.BuyButtonContainer}>
                            <TouchableOpacity style={styles.buyButton} onPress={()=>{
                                    
                                    createNotification(artistdata[artistIndex].userID, artPieceData[artistImageIndex].artPieceTitle, artPieceData[artistImageIndex].documentID)
                                    Alert.alert(`A notification has been sent to ${artistdata[artistIndex].artistName}. The artist will contact you`)
                                }}>
                                <Text>{activeArtPieceForSaleStatus ? "Tell Artist that you are interested in buying" : "This art piece is currently not for sale"} </Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                    <View style={styles.artPieceInfoContainer}>
                        <View style={styles.artistNameContainer}>
                            <Text style={styles.artistName}>"{artPieceData[artistImageIndex].artPieceTitle}" by {artistdata[artistIndex].artistName} </Text>
                        </View>
                        <View>
                            <Text>{artPieceData[artistImageIndex].customText}</Text>
                            <Text>Dimensions: {artPieceData[artistImageIndex].dimensions.height}cm x {artPieceData[artistImageIndex].dimensions.length}cm </Text>
                            <Text>Sales Price: {artPieceData[artistImageIndex].price}</Text>
                            
                        </View>
                         
                    </View>
                </View>
            </View>
        )
    }
    //end of functions that are used to render the page 



    //start of onClick functions

    async function dislikeArtist(artistUserID){
        //updates the artistIndex by using the setArtistIndex() method. This updates the page so that a new artist and artPieces are shown on screen.
            let oldArtistIndex = artistIndex
            let newArtistIndex = oldArtistIndex + 1
            setArtistIndex(newArtistIndex)
        
        //changes the artistImageIndex to 0 by using the setArtistImageIndex, so that the artist's first image is loaded. 
            let newArtistImageIndex = 0
            setArtistImageIndex(newArtistImageIndex)

        await fetchArtPieceData(artistData, newArtistIndex).then(renderPage())
    }



    async function likeArtist(artistUserID){
        //updates the artistIndex by using the setArtistIndex() method. This updates the page so that a new artist and artPieces are shown on screen.
            let oldArtistIndex = artistIndex
            let newArtistIndex = oldArtistIndex + 1
            setArtistIndex(newArtistIndex)
        
        //changes the artistImageIndex to 0 by using the setArtistImageIndex, so that the artist's first image is loaded. 
            let newArtistImageIndex = 0
            setArtistImageIndex(newArtistImageIndex)

        //adds the liked artist to an array (in the authenticated user's document on firestore DB), so that users can keep track of which artists they have liked.
            const authenticatedUserDocumentRef = doc(firebaseDB, `Users/${user.uid}`)//user = firebaseAuth.currentUser. this is defined on line 25
            updateDoc(authenticatedUserDocumentRef, {
                likedArtists: arrayUnion(`${artistUserID}`)
            })
        //adds the authenticated users id to the liked artists firestore document. this is used mainly for optimizing querying, but might be used later to show how many followers the artist has
            const likedArtistDocumentRef = doc(firebaseDB, `Users/${artistUserID}`)
            updateDoc(likedArtistDocumentRef, {
                likedBy: arrayUnion(`${user.uid}`)//user = firebaseAuth.currentUser. this is defined on line 25
            })
        await fetchArtPieceData(artistData, newArtistIndex).then(renderPage())
    }



    function likeArtPiece(artPiece, artistUserID){
        //adds the liked art piece to an array on the users firestore document, so that it is possible to keep track of which art piece the user has liked
            const authenticatedUserDocumentRef = doc(firebaseDB, `Users/${user.uid}`)//user = firebaseAuth.currentUser. this is defined on line 25
            console.log(`Users/${user.uid}`)
            updateDoc(authenticatedUserDocumentRef, {
                likedArtPiece: arrayUnion(`artPieces/${artPiece.artPieceTitle}PaintingUploadedBy${artistUserID}`)
            })

        //adds the authenticated users userID to the liked art piece's firestore document. this is used mainly for optimizing querying, but might be used later to show how many likes the art piece has
        const likedArtPieceDocumentRef = doc(firebaseDB, `artPieces/${artPiece.artPieceTitle}PaintingUploadedBy${artistUserID}`)
        updateDoc(likedArtPieceDocumentRef, {
            likedBy: arrayUnion(`${user.uid}`)//user = firebaseAuth.currentUser. this is defined on line 25
        })
        Alert.alert('Art Piece has been liked')
    }
    
    async function createNotification(uploaderUID, artPieceTitle, artPieceDocumentID){
        console.log("uploaderUID: ", uploaderUID)
        let firebaseStorageNotificationRef = ref(firebaseStorage, "notifications/")
        await addDoc(collection(firebaseDB, "notifications"), {
            sender: user.uid,
            receiver: uploaderUID,
            message: `${user.displayName} is interested in buying your art piece : ${artPieceTitle}. you can contact ${user.displayName} at this email: ${user.email}`,
            artPieceDocumentID: artPieceDocumentID,b 
        })
    }


    return(//this return function is the actual loading of the page
        <SafeAreaView>
            <StatusBar
            style= {hidden=false}
            />
            {loading &&  <Text style={{justifyContent: "center"}}>data is being loaded from the database</Text>}
            {!loading && renderPage(artistData, artistIndex, artPieceData, artistImageIndex)}          
        </SafeAreaView>//the renderPage function fires as soon as the loading variable is set to false. the renderPage actually contains all of the main page functionality
    )
    
}

const styles = StyleSheet.create({
    
    container: {
        backgroundColor: "lightblue",
        overflow: "hidden",
        width: "100%",
        height: "100%",
    },
    ImageNavigationShadowsContainer:{ 
        width: "100%",
        height: "75%",
        overflow:"hidden",
        resizeMode: "contain"
        
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
        nonImageContainer:{
            overflow: "hidden",
            width: "100%",
            height: "25%",
        },
        buttonContainer:{
            width: "100%",
            height: "40%",
            flexDirection: "column",
            marginBottom: "2%"
        },    
            likeButtonContainer:{
                width: "100%",
                height: "40%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignContent: "space-around",
                marginVertical: "2%"
            },
                button:{
                    backgroundColor: '#0a5da6',
                    width: '30%',
                    padding: 5,
                    marginBottom: 0,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: "space-evenly"
                },
            BuyButtonContainer:{    
                width: "100%",
                height: "40%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignContent: "space-around",
                

            },
            buyButton:{
                backgroundColor: '#0a5da6',
                width: '90%',
                padding: 5,
                marginBottom: 0,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: "center"
            },
        artPieceInfoContainer: {
            width: "100%",
            height: "80%",
            flexDirection: "column",
            
        },
            artistNameContainer: {
                height: "15%",
                width: "100%",
                backgroundColor:"black"
            },
                artistName:{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    textAlignVertical: "center",
                    color: "white"
                },
            artPieceInfo: {
                width: "100%",
                height: "80%",
            },
            
  });
export default MainScreen