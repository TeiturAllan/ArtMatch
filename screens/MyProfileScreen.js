import React from "react";
import { useState, useEffect } from "react";

import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

//firebase importation and definitions
//firebase imports
import { getApp } from "firebase/app";
//import from firebase authentication
    import { getAuth, signOut } from "firebase/auth";
//import for firebase storage
    import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
//imports for cloud firestore (database)
    import { getFirestore, doc, getDocs, query, where, collection } from "firebase/firestore";



//importation of Screens that will be used in the MyProfileStack
import EditProfileScreen from "./EditProfileScreen"; <EditProfileScreen/>
import UploadArtPieceScreen from "./UploadArtPieceScreen"; <UploadArtPieceScreen/>
import ImagesPreviewComponent from "../components/componentsForMyProfileScreen/ImagesPreviewComponent"; <ImagesPreviewComponent/>
import EditOwnArtPieceScreen from "./EditOwnArtPieceScreen"; <EditOwnArtPieceScreen/>
import NotificationsScreen from "./NotificationsScreen"; <NotificationsScreen/>


const Stack = createNativeStackNavigator();

function MyProfileStack(){//this is the component that gets exported, as i want tab-navigation for general navigation on the app, but stack navigation on specific section of the app.
    return(
        <Stack.Navigator>
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen name="Upload Art Piece" component={UploadArtPieceScreen}/>
            <Stack.Screen name="Edit Art Piece" component={EditOwnArtPieceScreen}/>
            <Stack.Screen name="Notifications screen" component={NotificationsScreen}/>
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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const isFocused = useIsFocused();
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

    const fetchData = async() => {//this function fetches the data as parses/places in into the variable called "data" 
        
        const resp = await getDocs(imagesUploadedByUserQuery)
        
        setData(resp)
        setLoading(false)
    }

    const renderItem = (data) => { //this function renders what will be shown after the data has been returned from the database
        dataInArray = []
        data.forEach((doc) => {
            //console.log('documentStart')
            //console.log(doc.id, "=>", doc.data());
            docResult = doc.data()
            dataInArray.push(docResult)
        })
        console.log(dataInArray)
        
        //console.log(dataInArray)
        return(
            <SafeAreaView style={styles.artPieceList}>
                {dataInArray.map((item, index) => (
                    <View style={styles.artPieceContainer} key={index}>
                        <TouchableOpacity  style={styles.artPieceFrame} onPress={()=> {navigation.navigate('Edit Art Piece',{documentID: item.documentID})}}>
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

// start of UI for My Profile Screen
    if(isFocused === true){//this is only placed here so that the page will refresh, men it is back in focus (after someone has pressed back to return to this screen) this has been done as updates to the user would not load after being updated
        return(
            <ScrollView style={{backgroundColor: "lightblue"}}>
                <View style={styles.userInfoContainer}>
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
                            onPress={()=> {fetchData()}}
                        >
                            <Text style>update page (page will refresh automatically next itteratio)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {loading && <Text> Loading </Text>}
                    {data && renderItem(data)}
                </View>
            </ScrollView>
        )
    } else {
        return( //this should never happen, but is placed here just in case
            <View>
                <Text>something went wrong</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    userInfoContainer: {
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
            
        },
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
  });

export default MyProfileStack