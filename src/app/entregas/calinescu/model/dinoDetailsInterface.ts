export interface WikipediaResponse {
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}