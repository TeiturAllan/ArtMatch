import React from "react";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-paper";

function EditProfileScreen() {
    const auth = getAuth()
    const user = auth.currentUser

    const [displayName, setDisplayName] = useState(user.displayName)
    const [profilePicURL, setProfilePicURL] = useState(user.photoURL)

    //this function only allows users to provide a link to their image, this should be fixed in later itterations of the app.
    function handleUserUpdate(displayName, profilePicURL){
        console.log('new display name: '+ displayName)
        console.log('new profile pic URL: ' + profilePicURL)
        updateProfile(auth.currentUser, {
            displayName: displayName, photoURL: profilePicURL
        }).then(() => {
            console.log('profile updated')                
        }).catch((error) => {
            console.log('something went wrong during the update')
        });
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
              <TouchableOpacity
                onPress={handleUserUpdate(displayName, profilePicURL)}
                style={[styles.button, styles.buttonOutline]}
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
    button: {
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