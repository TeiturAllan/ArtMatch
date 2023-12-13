import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from "react-native-paper";

//importation of firebase
import { getApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

function EditProfileScreen() {
  //start of importation of methods from firebase
  const firebaseApp = getApp()
    ////used for cloud firestore
    const firebaseDB = getFirestore(firebaseApp)
    //firebase auth
    const auth = getAuth()
    const user = auth.currentUser
    console.log(user)
    //states used to update info
    const [displayName, setDisplayName] = useState(user.displayName)
    const [profilePicURL, setProfilePicURL] = useState(user.photoURL)
    const [userIsPublic, setUserIsPublic] = useState(false) //the default method here is false, so a user has to manually press the userIsPublic (yes or no) button everytime they update their account and wish to remain public

    //this function only allows users to provide a link to their image, this should be fixed in later itterations of the app.
    const handleUserUpdate = async() => {
        console.log('new display name: '+ displayName)
        console.log('new profile pic URL: ' + profilePicURL)
        console.log('user is public: ', userIsPublic)
        const userFirestoreRef = doc(firebaseDB, `Users/${user.uid}`)
        
        updateProfile(auth.currentUser, {//updates the user in the firebase authentication database
          displayName: displayName, photoURL: profilePicURL
        }).catch((error) => {
          Alert.alert('something went wrong during the update')
        });

        await updateDoc(userFirestoreRef, {//this updates the user on the firestore database, this update is more important
          userIsPublic: userIsPublic, artistName: displayName
        }).then(() => {
          Alert.alert('Your Profile Has Been Updated')                
        }).catch((error) => {
          Alert.alert('something went wrong during the update')
        });
        
    }
    
    function toggleUserIsPublicButton(){
      if(userIsPublic === false){
        setUserIsPublic(true)
      }
      if(userIsPublic === true){
        setUserIsPublic(false)
      }
    }
      
    

    return(
        <View style={styles.container}>
            <Text>this is the page were you will be able to update your user information</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='User Name'
                    value={displayName}
                    onChangeText={text => setDisplayName(text)}
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='ProfilePicURL'
                    value={profilePicURL}
                    onChangeText={text => setProfilePicURL(text)}
                    style={styles.input}
                />
            </View>
            <View style={styles.buttonContainer}>
            <Text> Allow others to see your profile?  </Text>
              <TouchableOpacity
                onPress={toggleUserIsPublicButton}
                style={styles.Publicizebutton}
              >
                <Text style={styles.buttonText}> {userIsPublic ? "yes" : "no"} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUserUpdate}
                style={styles.Updatebutton}
              >
                <Text style={styles.buttonText}>Update User</Text>
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: 'center',
      backgroundColor: 'lightblue'
    },
    inputContainer:{
      width: '80%',
      justifyContent: "center",
      alignContent: "center"
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      marginTop: 10
    },
    buttonContainer: {
      marginTop: 30,
      width: '100%'
  
    },
    Publicizebutton: {
      backgroundColor: '#0a5da6',
      width: '30%',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      alignItems: 'center'
    },
    Updatebutton: {
      backgroundColor: '#0a5da6',
      width: '100%',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      alignItems: 'center'
    },
    buttonText: {
      color: 'white',
      fontSize: 16
    }
  });

export default EditProfileScreen