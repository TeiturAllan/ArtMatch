import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity, Alert  } from 'react-native';

import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query, updateDoc, arrayUnion  } from "firebase/firestore";
        
function EditOwnArtPieceScreen({route, navigation}) {
    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        const artPieceFirestoreRef = doc(firebaseDB, "artPieces", `${documentID}`)


    const {documentID} = route.params
    let chosenDocumentRef = doc(firebaseDB, "artPieces", `${documentID}`)
    const [documentData, setDocumentData] = useState(null)
    const [loading, setLoading] = useState(true)


    const [artPieceTitle, SetArtPieceTitle] = useState(artPieceTitle)
    const [lengthDimensionCM, SetlengthDimensionCM] = useState(lengthDimensionCM) //CM stands for centimeter
    const [heightDimensionCM, SetHeightDimensionCM] = useState(heightDimensionCM) //CM stands for centimeter
    const [customText, SetCustomText] = useState(customText)
    const [price, SetPrice] = useState("")
    const [forSale, setForSale] = useState(forSale)

    const toggleSwitch = () => {
        if(forSale === false){
            setForSale(true)
            SetPrice("")
        }
        if(forSale === true){
            setForSale(false)
            SetPrice('Not For Sale')
        }
    }

    async function updateArtPieceInfo(){
        await updateDoc(chosenDocumentRef, {
            artPieceTitle: artPieceTitle,
            dimension: { length: lengthDimensionCM, height: heightDimensionCM},
            customText: customText,
            price: price,
            forSale: forSale
        }).then(Alert.alert("Your Art Piece's info has been updated"))
    }
    useEffect(()=> {
        fetchData();
    }, [])

    const fetchData = async() => {//this function fetches the data as parses/places in into the variable called "data" 
        
        const docSnap = await getDoc(chosenDocumentRef);
        if (docSnap.exists()) {
          data = docSnap.data()
          SetArtPieceTitle(data.artPieceTitle)
          SetlengthDimensionCM(data.dimensions.length)
          SetHeightDimensionCM(data.dimensions.height)
          SetCustomText(data.customText)
          setForSale(data.forSale)
          SetPrice(data.price)
          setDocumentData(data)
          setLoading(false)
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
        
    }
    
    function renderItem(documentData){

        return(
            <View>
                <View style={styles.inputContainer}>
                <TextInput 
                  value={artPieceTitle}
                  onChangeText={text => SetArtPieceTitle(text)}
                  style={styles.input}

                />
                <Text> The measurents are meant to be the dimensions of the canvas (painting without a frame)</Text>
                <View style={styles.dimensionsInputContainer}>
                  <TextInput 
                    placeholder='Length'
                    value={lengthDimensionCM}
                    onChangeText={text => SetlengthDimensionCM(text)}
                    style={styles.DimensionsInput}
                  />
                  <Text> X </Text>
                  <TextInput 
                  placeholder='Height'
                  value={heightDimensionCM}
                  onChangeText={text => SetHeightDimensionCM(text)}
                  style={styles.DimensionsInput}
                />
                </View>
                <TextInput 
                  placeholder='Custom text, that will be shown alongside image'
                  value={customText}
                  onChangeText={text => SetCustomText(text)}
                  style={styles.customTextInput}
                />
                <TextInput 
                  placeholder='Sales price of art piece'
                  value={price}
                  onChangeText={text => SetPrice(text)}
                  style={styles.customTextInput}a
                />
                <View>
                    <Text>Art Piece is for sale: {String(forSale)} </Text>
                    <Switch
                    onValueChange={toggleSwitch}
                    value={forSale}
                    />
                </View>
                <TouchableOpacity
                style={styles.UpdateButton}
                onPress={()=> updateArtPieceInfo()}>
                    <Text>Update ArtPiece</Text>
                </TouchableOpacity>
                    
                
                
            </View>
            </View> 
        )

    } 

    return(
        <View>
            <Text>this is the screen were you will be able to edit a few values of your uploaded art pieces</Text>
            {!loading && renderItem(documentData)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        backgroundColor: 'lightblue',
        overflow: "scroll"
    },
    inputContainer:{
        width: '80%'
    },
        input: {
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 5
        },
        dimensionsInputContainer: {
            width: '100%',
            flexDirection: "row"
        },
            DimensionsInput:{
                width: '25%',
                backgroundColor: 'white',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 10,
                marginTop: 5
            },
        customTextInput: {
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderRadius: 10,
            marginTop: 5,
            marginBottom: 5
        },
    
    UpdateButton: {
        backgroundColor: '#0a5da6',
        width: '50%',
        padding: 5,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    chosenImageFrame:{
        backgroundColor: "lightblue",
        flexDirection: "row",
        width: "100%",
        overflow: "hidden"
    },
  });


export default EditOwnArtPieceScreen