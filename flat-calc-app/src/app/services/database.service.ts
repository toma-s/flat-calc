// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CompletedService, Neighbor, Service } from '../models/database-models';
import { firebaseConfig } from 'src/environments/firebase-config';
import { DatabaseCollections } from '../types/types';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {

    constructor(
        private firestore: AngularFirestore
    ) { }

    initializeDB() {
        firebase.initializeApp(firebaseConfig);
    }


    // services

    getServicesList(): Observable<Service[]> {
        return this.firestore.collection('services').snapshotChanges().pipe(
            map((data: any[]) => data.map((d: any) => {
                // console.log(d);
                return this.mapToService(d.payload.doc);
            }))
        );
    }

    mapToService(payload: any): Service {
        return {
            id: payload.id,
            title: payload.data().title,
            details: payload.data().details,
            points: payload.data().points,
        }
    }

    putService(data: Service) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('services')
                .add(data)
                .then(res => { }, err => reject(err));
        });
    }

    deleteService(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('services')
                .doc(id)
                .delete()
                .then(res => { }, err => console.log(err));
        });
    }

    // updateService(id: string, newData: {}) {
    //     return new Promise<any>((resolve, reject) => {
    //         this.firestore
    //             .collection('services')
    //             .doc(id)
    //             .update(newData)
    //             .then(res => { }, err => reject(err));
    //     });
    // }


    // completed services

    getCompletedServices(): Observable<CompletedService[]> {
        return this.firestore.collection(DatabaseCollections.CompletedServices).snapshotChanges().pipe(
            map((data: any[]) => data.map((d: any) => {
                console.log(d);
                return this.mapToCompletedService(d.payload.doc);
            }))
        );
    }

    mapToCompletedService(payload: any): CompletedService {
        return {
            id: payload.id,
            service: payload.data().service,
            neighbor: payload.data().neighbor,
            comment: payload.data().comment,
            dateCompleted: payload.data().dateCompleted,
            dateCreated: payload.data().dateCreated,
        }
    }

    putCompletedService(data: CompletedService) {
        console.log(data);
        
        const id = this.firestore.createId();
        data.id = id;

        return new Promise<any>((resolve, reject) => {
            this.firestore
                .doc(`${DatabaseCollections.CompletedServices}/${id}`)
                .set(data)
                .then(res => { }, err => console.log(err));
        });
    }

    deleteCompletedService(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection(DatabaseCollections.CompletedServices)
                .doc(id)
                .delete()
                .then(res => { }, err => console.log(err));
        });
    }


    // neighbors

    getNeighbors(): Observable<Neighbor[]> {
        return this.firestore.collection('neighbors').snapshotChanges().pipe(
            map((data: any[]) => data.map((d: any) => {
                // console.log(d);
                return this.mapToNeighbor(d.payload.doc);
            }))
        );
    }

    mapToNeighbor(payload: any): Neighbor {
        return {
            id: payload.id,
            name: payload.data().name,
        }
    }

    getNeighborsWithPoints(): Observable<any[]> {
        // const test = this.getCompletedServicesJoinNeighbors().pipe(
        //     map((serNeighList: CompletedServiceJoinNeighbors[]) => serNeighList.map(() =>

        //         groupBy((serNeigh: CompletedServiceJoinNeighbors) => serNeigh.neighbor?.id),
        //         // mergeMap((group: any) => group.pipe(toArray())),
        //     ))
            
        // );
        // test.subscribe((data) => console.log(data));
        return of([]);
    }

}