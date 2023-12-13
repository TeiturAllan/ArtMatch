import React from "react";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';

//firebase imports
    import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection } from "firebase/firestore";


function ImagesPreviewComponent() {
    
    //start of importation of methods from firebase
    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        const imagesUploadedByUserQuery = query(collection(firebaseDB, "artPieces"), where("uploaderUID", "==", `${user.uid}`))
    //end of importations of methods from firebase
    

    //hooks used for rendering data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const fetchData = async() => {//this function fetches the data as parses/places in into the variable called "data" 
        
        const resp = await getDocs(imagesUploadedByUserQuery)
        
        setData(resp)
        setLoading(false)
        renderItem(resp)//this sends the queried data to the render item function, which will eventually tell the component what to render
    }

    const renderItem = (data) => { //this function renders what will be shown after the data has been returned from the database
        dataInArray = []
        console.log('start of console.loggin')
        data.forEach((doc) => {
            console.log('documentStart')
            console.log(doc.id, "=>", doc.data());
            docResult = doc.data()
            dataInArray.push(docResult)
        })
        
        //console.log(dataInArray)
        return(
            <SafeAreaView style={styles.artPieceList}>
                {dataInArray.map((item, index) => (
                    <View style={styles.artPieceContainer} key={index}>
                        <TouchableOpacity  style={styles.artPieceFrame}>
                                <Image source={ {uri: item.downloadURL}} style={styles.artPiece} />
                        </TouchableOpacity>
                        <View style={styles.artPieceTextContainer}> 
                            <Text style={styles.artPieceTitle}>{item.artPieceTitle} </Text>
                            <Text >{item.dimensions.height} cm x {item.dimensions.length} cm </Text>
                            <Text >{item.customText} </Text>
                        </View>
                    </View>
                ))}
            </SafeAreaView>
        )
    }

    useEffect(()=> {
        fetchData();
    }, [])

    return(
        <View>
            {loading && <Text> Loading </Text>}
            {data && renderItem(data)}
        </View>
    )
    
}

const styles = StyleSheet.create({
    artPieceList: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        
    },
    artPieceContainer: {
        width: "100%", 
        backgroundColor: "lightgrey",
        flexDirection: "row",
        marginVertical: 3,
    },
        artPieceFrame: {
            width: "40%",
            height: 150,
            borderWidth: 1,

            overflow:"hidden",
            backgroundColor: "lightblue"
        },
            artPiece:{
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                resizeMode: "contain" 
            },
        artPieceTextContainer:{
            width: "60%",
            backgroundColor: "white",
            
        },
            artPieceTitle: {
                width: "100%",
                backgroundColor: "green",
                textAlign: "center" 
                
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
    ProfilePictureContainer: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
        ProfilePictureFrame: {
            backgroundColor: 'white',
            
            height: 160,
            width: 160,
            borderRadius: 80
            },
            profilePicture: {
                
                height: 160,
                width: 160,
                borderRadius: 80
            },
    ArtistNameBarContainer: {
        marginTop: 20,
        
        alignItems: 'center'
    },
        LineUnderArtistName: {
            width: '90%',
            backgroundColor: 'green',
            height: 5
            
        }
    
  });

export default ImagesPreviewComponent