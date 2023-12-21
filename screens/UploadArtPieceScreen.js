import React from "react";
import { useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

//firebase importation
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";




function UploadArtPieceScreen() {
    //start of importation of methods from firebase
    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        

        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        
    //end of importation of methods from firebase
    
    //start of states that will be used when the image is uploaded
    const [artPieceTitle, SetArtPieceTitle] = useState(null)
    const [lengthDimensionCM, SetlengthDimensionCM] = useState(null) //CM stands for centimeter
    const [heightDimensionCM, SetHeightDimensionCM] = useState(null) //CM stands for centimeter
    const [customText, SetCustomText] = useState(null)
    const [price, SetPrice] = useState(null)
    const [image, SetImage] = useState(null) //this state uses the whole image information, rather than just the URI/URL, because som of the attached metadata is used in calculations
    const [uploading, SetUploading] = useState(false)
    
    //start of calculations used to make sure that the chosen image retains it's aspect ratio while remaining as large as possible (so that it's easier to see)
    const win = Dimensions.get('window')
    const [imageRatio, setImageRatio] = useState(null)
    
    

    const pickImage = async() => {
        console.log('yay you got this far')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        
        if(!result.canceled){
            console.log('you got even further this time!')
            SetImage(result)
            const ratio = win.width/result.assets[0].height
            console.log("the image ratio is: " + ratio)
            setImageRatio(ratio)
        }
    }

    uploadImageAndInfo = async () => { //this function as well as the uploadImageAsync function have been plucked from this example code provided by expo: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js#L193
        if(artPieceTitle === null || lengthDimensionCM === null || heightDimensionCM === null || customText === null){
            Alert.alert('In order to upload, you must first provide the necessary information about your artpiece')
        } else {
            try {
                let firebaseStorageArtPieceRef = ref(firebaseStorage, `artistData/${user.uid}/artPieces/${artPieceTitle}PaintingUploadedBy${user.uid}`)//this will be the pathName Of The Art Piece Inside The Firebase storage bucket, this must be dynamic
                SetUploading(true)
                const downloadUrl = await uploadImageAsync(image.uri, firebaseStorageArtPieceRef); //this triggers the uploadImageAsync function which uploads the chosen image. This function is async, as we need the uploadURL later inorder to store the URL with the other information stored in firestore
                console.log('downloadUrl', downloadUrl)
                SetImage(null)
                uploadArtPieceDocToFirestore(downloadUrl, firebaseStorageArtPieceRef)//the image is already uploaded to firebase storage when this function triggers. this function stores all of the relevant information of that artpiece onto the cloud firestore database
            } catch (e) {
                console.log(e);
                Alert.alert("Upload failed, sorry :(");
            } finally {
                SetUploading(false)
            }
        }
    };

    async function uploadImageAsync(uri, firebaseStorageArtPieceRef) { //this function as well as the uploadImageAndInfo function have been plucked from this example code provided by expo: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js#L193
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        try{ //the whole function is wrapped inside try/catch to ensure that an image is not uploaded to storage, if something fails. if something fails then the user will get an alert telling them that the upload failed
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                  console.log(e);
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });
            
            const metaData = {contentType: "image"} //this tells Firebase storage that an image has been uploaded
            const result = await uploadBytes(firebaseStorageArtPieceRef, blob, metaData);
    
            // We're done with the blob, close and release it
            blob.close();
            return await getDownloadURL(firebaseStorageArtPieceRef); //returns the downloadURL which will be stored inside the soon to be created document on the firestore database
        } catch (e) {
            console.log(e);
            Alert.alert("Upload failed, sorry :(");
        }
    }

    async function uploadArtPieceDocToFirestore(downloadURL, firebaseStorageArtPieceRef){//this function creates a document, with all of the relevant artPiece information, onto the firestore database, 
        const artPieceFirestoreRef = `${artPieceTitle}PaintingUploadedBy${user.uid}`
        const userFirestoreRef = doc(firebaseDB, `Users/${user.uid}`)
        await setDoc(doc(firebaseDB, "artPieces", artPieceFirestoreRef), {
            artPieceTitle: artPieceTitle,
            dimensions: {
                length: lengthDimensionCM,
                height: heightDimensionCM
            },
            documentID: artPieceFirestoreRef,
            customText: customText,
            uploaderUID: user.uid,
            downloadURL: downloadURL,
            firebaseStorageArtPieceRef: `${firebaseStorageArtPieceRef}`,
            forSale: false
        })
        console.log(artPieceFirestoreRef)
        await updateDoc(userFirestoreRef, {
            artPiecesUploaded: arrayUnion(`${artPieceFirestoreRef}`)
        }).then(Alert.alert('Your Art Piece has succesfully been uploaded'))
    }
    
    return(//start of UI
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder='Title Of Art Piece'
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
            </View>
            <TouchableOpacity style={styles.UploadImageButton}
            onPress={pickImage}>
                <Text>
                    Click here to choose which image to upload
                </Text>
            </TouchableOpacity>
            <View style={styles.chosenImageFrame}>
                {image && <Image source={{ uri: image.assets[0].uri }}  resizeMode="contain" style={{width: win.width, height: image.assets[0].height * imageRatio, backgroundColor: "lightblue"}} />}
            </View>
            {image && //this makes sure that the upload button only exists if an image has been chosen
                <TouchableOpacity style={styles.UploadImageButton}
                    onPress={uploadImageAndInfo}>
                    <Text>
                        Upload Image
                    </Text>
                </TouchableOpacity>
            }
        </View>
    </ScrollView>
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
    
    UploadImageButton: {
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


  //style={{overflow: "hidden", resizeMode: 'center', aspectRatio: image.assets[0].height/image.assets[0].width, flex: 1 /*height: image.assets[0].height, width: image.assets[0].width*/ }}
export default UploadArtPieceScreen