export interface Dino {
    Name: string;
    Description: string;
    extract?: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}
