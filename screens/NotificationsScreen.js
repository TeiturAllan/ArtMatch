import React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query, updateDoc, arrayUnion, setDoc, addDoc  } from "firebase/firestore";



function NotificationsScreen() {

    const firebaseApp = getApp()
        //importing user information, so that i can register who uploaded the image/art piece
        const auth = getAuth()
        const user = auth.currentUser
        
        //used for firebase storage
        const firebaseStorage = getStorage(firebaseApp)
        //used for cloud firestore
        const firebaseDB = getFirestore(firebaseApp)
        const notificationQuery = query(collection(firebaseDB, "notifications"), where("receiver", "==", user.uid))

    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    /*
    useEffect(()=> {
        fetchData();
    }, [])

    async function fetchData(){
        const dataInArray = []
        const querySnapsot = await getDocs(notificationQuery);
        querySnapsot.forEach((doc) => {
            dataInArray.push(doc.data())
        })
        setData(dataInArray)
        setLoading(false)
    }

    function renderPage(dataToBeHandled){
        console.log("renderPageMode started")
        console.log(data)
        dataInArray = []
        
        
        console.log(dataInArray)
        //console.log(dataInArray[0].message)
        return(
            <SafeAreaView>
                <Text>{data[0].message} </Text>
            </SafeAreaView>
        )
    }
    */

    
    return(
        <View>
            <Text>this has not been fully implemented yet</Text>
        </View>
    )
}

export default NotificationsScreen