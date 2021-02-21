import { Inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import { Observable } from "rxjs";
import { Services } from "../types/database-models";

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {

    constructor(
        private firestore: AngularFirestore
    ) { }

    initializeDB() {
        // Set the configuration for your app
        const firebaseConfig = {
            apiKey: "AIzaSyCaN6DKKOIVP0tQbkg5up2TJdTw18HTtBQ",
            authDomain: "flatcalc-22be6.firebaseapp.com",
            databaseURL: "https://flatcalc-22be6-default-rtdb.firebaseio.com",
            projectId: "flatcalc-22be6",
            storageBucket: "flatcalc-22be6.appspot.com",
            messagingSenderId: "568952496390",
            appId: "1:568952496390:web:b004c78f49ad15e20bbe87"
        };
        firebase.initializeApp(firebaseConfig);

        // Get a reference to the database service
        // return firebase.database();
    }

    getMessages() {
        return this.firestore.collection("messages").snapshotChanges();
    }

    getServices(): Observable<any[]> {
        return this.firestore.collection("services").snapshotChanges();
    }

    putMessage(data: {}) {
        return new Promise<any>((resolve, reject) =>{
            this.firestore
                .collection("messages")
                .add(data)
                .then(res => {}, err => reject(err));
        });
    }

    putService(data: {}) {
        return new Promise<any>((resolve, reject) =>{
            this.firestore
                .collection("services")
                .add(data)
                .then(res => {}, err => reject(err));
        });
    }


}