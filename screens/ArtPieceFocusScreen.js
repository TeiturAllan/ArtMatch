import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

import { getApp } from "firebase/app";
    //import from firebase authentication
        import { getAuth } from "firebase/auth";
    //import for firebase storage
        import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
    //imports for cloud firestore (database)
        import { getFirestore, doc, getDocs, query, where, collection, limit, getDoc, Query, updateDoc, arrayUnion  } from "firebase/firestore";

function artPieceFocusScreen(artPieceDocumentID) {


    return(
        <View>
            <Text>this is the screen were you will be able to adjust your app settings</Text>
        </View>
    )
}

export default artPieceFocusScreen