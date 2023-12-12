import React from "react";
import { useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

//firebase importation
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";





function UploadArtPieceScreen() {
    //importing user information, so that i can register who uploaded the image/art piece
    const auth = getAuth()
    const user = auth.currentUser

    //start of states that will be used when the image is uploaded
    const [artPieceTitle, SetArtPieceTitle] = useState(null)
    const [lengthDimensionCM, SetlengthDimensionCM] = useState(null) //CM stands for centimeter
    const [heightDimensionCM, SetHeightDimensionCM] = useState(null) //CM stands for centimeter
    const [customText, SetCustomText] = useState(null)
    const [image, SetImage] = useState(null) //this state uses the whole image information, rather than just the URI/URL, because som of the attached metadata is used in calculations

    const [imageMetaData, SetImageMetaData] = useState(null)
    const [uploading, SetUploading] = useState(false)
    //start of calculations used to make sure that the chosen image retains it's aspect ratio while remaining as large as possible (so that it's easier to see)
    const win = Dimensions.get('window')
    const [imageRatio, setImageRatio] = useState(null)
    
    //firebase modules used to upload images to firebase storage
    const firebaseApp = getApp()
    const firebaseStorage = getStorage(firebaseApp)
    const firebaseStorageArtPieceRef = ref(firebaseStorage, `artistData/${user.uid}/artPieces/${artPieceTitle}PaintingOwner${user.uid}`)//this will be the pathName Of The Art Piece Inside The Firebase storage bucket, this must be dynamic
    //console.log(firebaseStorage)
    
    

    const pickImage = async() => {
        console.log('yay you got this far')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        console.log(result.assets[0].uri)
        let InputMetaData = {
            contentType: result.assets[0].type,
            artPieceTitle: artPieceTitle,
            lengthDimension: lengthDimensionCM,
            heightDimension: heightDimensionCM,
            customText: customText
        }
        
        if(!result.canceled){
            console.log('you got even further this time!')
            SetImage(result)
            SetImageMetaData(InputMetaData)
            //console.log('ImageMetaData here: ' + imageMetaData)
            const ratio = win.width/result.assets[0].height
            console.log("the image ratio is: " + ratio)
            setImageRatio(ratio)
        }
    }
    //
    uploadImageAndInfo = async () => { //this function as well as the uploadImageAsync function have been plucked from this example code provided by expo: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js#L193
        if(artPieceTitle === null || lengthDimensionCM === null || heightDimensionCM === null || customText === null){
            Alert.alert('In order to upload, you must first provide the necessary information about your artpiece')

        } else {
            try {
                SetUploading(true)
                const uploadUrl = await uploadImageAsync(image.uri);
                console.log('uploadURL', uploadUrl)
                SetImage(null)
            
            } catch (e) {
                console.log(e);
                alert("Upload failed, sorry :(");
            } finally {
                SetUploading(false)
                Alert.alert('The Art Piece was uploaded successfully')
            }
        }
    };

    async function uploadImageAsync(uri) { //this function as well as the uploadImageAndInfo function have been plucked from this example code provided by expo: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js#L193
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
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
        const result = await uploadBytes(firebaseStorageArtPieceRef, blob, imageMetaData);
    
        // We're done with the blob, close and release it
        blob.close();
    
        return await getDownloadURL(firebaseStorageArtPieceRef);
    }

      /*
    async function upploadImageAndInfo(){
        if(artPieceTitle === null){
            Alert.alert('You must give your artPiece a name')

        } else {
  
        
        }
    }
*/
    
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