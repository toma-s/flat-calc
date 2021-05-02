export interface Service {
    id?: string;
    title: string;
    details: string;
    points: number;
}

export interface CompletedService {
    id?: string;
    title: string; // Service
    neighborId: string;
    neighborName?: string; // delete?
    dateCreated?: string | null;
    dateCompleted?: string | null;
    comment: string;
    points?: string;
}

export interface Neighbor {
    id: string;
    name: string;
}

// combined

export interface CompletedServiceJoinNeighbors {
    id?: string;
    title: string;
    neighbor?: Neighbor | null;
    dateCreated?: string | null;
    dateCompleted?: string | null;
    comment: string;
    points?: string;
}

export interface NeighborPoints {
    neighbor: Neighbor;
    points: number;
}
