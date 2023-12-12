import React from "react";
import { useState } from "react";

import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//firebase importation and definitions
import { getAuth, signOut } from "firebase/auth";



//importation of Screens that will be used in the MyProfileStack
import EditProfileScreen from "./EditProfileScreen"; <EditProfileScreen/>
import UploadArtPieceScreen from "./UploadArtPieceScreen";import { connectStorageEmulator } from "firebase/storage";
 <UploadArtPieceScreen/>

const Stack = createNativeStackNavigator();

function MyProfileStack(){//this is the component that gets exported, as i want tab-navigation for general navigation on the app, but stack navigation on specific section of the app.
    return(
        <Stack.Navigator>
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen name="Upload Art Piece" component={UploadArtPieceScreen}/>
        </Stack.Navigator>
    )
}

function determineImageURL(user) { //function used to determine the URL for the profile picture that will be displayed
    if (user.photoURL !== null) {
        return user.photoURL
    } else {//if the profile picture is undefined (no profile picture has been chosen by the user), then the default profile picture will be a question mark
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Blue_question_mark_icon.svg/1200px-Blue_question_mark_icon.svg.png'
    }
}

function determineProfileName(user){
    if (user.displayName !== null) {
        return user.displayName
    } else {//if the profile does not have a displayName (displayName = null) then the line below will be shown where the username should be displayed 
        return 'you have not inserted a name yet, press the "edit profile" button to insert a username'
    }
}

function MyProfileScreen({navigation}) {
    const auth = getAuth()
    const user = auth.currentUser
    const imageURL = determineImageURL(user)
    const userDisplayName = determineProfileName(user)

    const handleLogOut = async () => {
        await signOut(auth).then(()=> {
            //signout successful
            console.log('Signed out successfully')
        }).catch((error) => {
            console.log('Signout not successful')
        })
    }


// start of UI for My Profile Screen
    return(
        <View style={styles.container}>
            <View id="TopButtonContainer" style={styles.TopButtonContainer}>
                <TouchableOpacity style={styles.editProfileButton}
                    onPress={()=> {navigation.navigate('Edit Profile')}}    
                >
                    <Text style>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.LogOutButton}
                    onPress={handleLogOut}
                >
                    <Text style>Log Out</Text>
                </TouchableOpacity>
            </View>
            <View id="ProfilePictureContainer" style={styles.ProfilePictureContainer}>
                <View id="ProfilePictureFrame" style={styles.ProfilePictureFrame}>
                    <Image style={styles.profilePicture}
                    source={{ uri: imageURL }}
                    resizeMode="contain"
                    />
                </View>
            </View>
            <View id="ArtistNameBarContainer" style={styles.ArtistNameBarContainer}>
                <Text>{userDisplayName}</Text>
                <View id="LineUnderArtistName" style={styles.LineUnderArtistName}></View>
            </View>
            <View id="TopButtonContainer" style={styles.TopButtonContainer}>
                <TouchableOpacity style={styles.editProfileButton}
                    onPress={()=> {navigation.navigate('Upload Art Piece')}}
                >
                    <Text style>Upload new art piece</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.LogOutButton}
                    //onPress={}
                >
                    <Text style>Place uploaded image for sell</Text>
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

export default MyProfileStack