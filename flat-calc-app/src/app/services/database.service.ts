// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { uniq } from "lodash";
import { Observable, combineLatest, of } from 'rxjs';
import { groupBy, map, switchMap } from 'rxjs/operators';

import { CompletedService, CompletedServiceJoinNeighbors, Neighbor, NeighborPoints, Service } from '../models/database-models';
import { firebaseConfig } from 'src/environments/firebase-config';

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

    getNeighbors(): Observable<Neighbor[]> {
        return this.firestore.collection('neighbors').snapshotChanges().pipe(
            map((data: any[]) => data.map((d: any) => {
                // console.log(d);
                return this.mapToNeighbor(d.payload.doc);
            }))
        );
    }

    getMessages() {
        return this.firestore.collection('messages').snapshotChanges();
    }

    getCompletedServicesJoinNeighbors(): Observable<CompletedServiceJoinNeighbors[]> {
        return this.firestore.collection<CompletedService>('completedServices').valueChanges().pipe(
            switchMap(completedServices => {
                const neighborIds = uniq(completedServices.map(cs => cs.neighborId))

                return combineLatest(
                    of(completedServices),
                    combineLatest(
                        neighborIds.map(neighborId =>
                            this.firestore.collection<Neighbor>('neighbors', ref => ref.where('id', '==', neighborId)).valueChanges().pipe(
                                map(neighbors => neighbors[0])
                            )
                        )
                    )
                )
            }),
            map(([completedServices, neighbors]) => {
                return completedServices.map(completedService => {
                    // console.log(completedService);
                    // console.log(neighbors);

                    return {
                        ...completedService,
                        neighbor: neighbors.find(a => {
                            // console.log(a);

                            return a.id === completedService.neighborId;
                        }),
                    }
                })
            })
        );
    }

    getNeighborsWithPoints(): Observable<NeighborPoints[]> {
        const test = this.getCompletedServicesJoinNeighbors().pipe(
            map((serNeighList: CompletedServiceJoinNeighbors[]) => serNeighList.map(() =>

                groupBy((serNeigh: CompletedServiceJoinNeighbors) => serNeigh.neighbor?.id),
                // mergeMap((group: any) => group.pipe(toArray())),
            ))
            
        );
        test.subscribe((data) => console.log(data));
        return of([]);
    }

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

    mapToCompletedService(payload: any): CompletedService {
        return {
            id: payload.id,
            title: payload.data().title,
            neighborId: payload.data().neighborId,
            comment: payload.data().comment,
            dateCompleted: payload.data().dateCompleted,
            dateCreated: payload.data().dateCreated,
            points: payload.data().points,
        }
    }

    mapToNeighbor(payload: any): Neighbor {
        return {
            id: payload.id,
            name: payload.data().name,
        }
    }

    putMessage(data: {}) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('messages')
                .add(data)
                .then(res => { }, err => reject(err));
        });
    }

    putService(data: Service) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('services')
                .add(data)
                .then(res => { }, err => reject(err));
        });
    }

    putCompletedService(data: CompletedService) {
        const id = this.firestore.createId();
        data.id = id;

        return new Promise<any>((resolve, reject) => {
            this.firestore
                .doc(`completedServices/${id}`)
                .set(data)
                .then(res => { }, err => console.log(err));
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

    deleteCompletedService(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('completedServices')
                .doc(id)
                .delete()
                .then(res => { }, err => console.log(err));
        });
    }

    updateService(id: string, newData: {}) {
        return new Promise<any>((resolve, reject) => {
            this.firestore
                .collection('services')
                .doc(id)
                .update(newData)
                .then(res => { }, err => reject(err));
        });
    }


}