export interface Service {
    id: string;
    title: string;
    details: string;
    points: number;
}

export interface Neighbor {
    id: string;
    name: string;
}

export interface CompletedService {
    id: string;
    service: Service;
    neighbor: Neighbor;
    dateCreated: string;
    dateCompleted: string;
    comment: string;
}
