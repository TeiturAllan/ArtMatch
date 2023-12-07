import React from "react";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function MyProfileScreen() {
    const auth = getAuth()
    const user = auth.currentUser
    console.log(user)

    const handleLogOut = async () => {
        await signOut(auth).then(()=> {
            //signout successful
            console.log('Signed out successfully')
        }).catch((error) => {
            console.log('Signout not successful')
        })
    }



    return(
        <View>
            <Text>this is the screen where you will be able to see all of your profile information</Text>
            <Text>The user that is logged in is {user.email} </Text>
            <TouchableOpacity style={styles.LogOutButton}
            onPress={handleLogOut}>
                <Text style>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightblue'
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
    buttonContainer: {
      marginTop: 30,
      width: '60%'
  
    },
    LogOutButton: {
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

export default MyProfileScreen