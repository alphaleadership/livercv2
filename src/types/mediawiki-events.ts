export interface RecentChange {
    $schema: string;
    meta: {
        uri: string;
        request_id: string;
        id: string;
        dt: string;
        domain: string;
        stream: string;
        topic: string;
        partition: number;
        offset: number;
    };
    id?: number;
    type: 'edit' | 'new' | 'log' | 'categorize';
    namespace: number;
    title: string;
    comment: string;
    timestamp: number;
    user: string;
    bot: boolean;
    minor?: boolean;
    length?: {
        old: number;
        new: number;
    };
    revision?: {
        old: number;
        new: number;
    };
    server_url: string;
    server_name: string;
    wiki: string;
}
