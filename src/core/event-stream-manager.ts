import { RecentChange } from '@/types/mediawiki-events';

export type ChangeCallback = (change: RecentChange) => void;

export class EventStreamManager {
    private eventSource: EventSource | null = null;
    private isPaused: boolean = false;
    private callbacks: ChangeCallback[] = [];
    private streamUrl: string = 'https://stream.wikimedia.org/v2/stream/recentchange';

    constructor(private wikis: string[] = ['frwiki']) {}

    public connect(): boolean {
        if (this.eventSource) {
            this.disconnect();
        }

        try {
            this.eventSource = new EventSource(this.streamUrl);
            this.eventSource.onmessage = (event: MessageEvent) => {
                if (this.isPaused) return;

                const data: RecentChange = JSON.parse(event.data);
                
                // Filtrage initial par wiki (pourrait être déplacé dans un filtreur dédié)
                if (this.wikis.includes(data.wiki)) {
                    this.notify(data);
                }
            };

            this.eventSource.onerror = (error) => {
                console.error('EventStream Error:', error);
                // On pourrait implémenter un retry ici
            };

            return true;
        } catch (error) {
            console.error('Failed to connect to EventStream:', error);
            return false;
        }
    }

    public disconnect(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    public onNewChange(callback: ChangeCallback): void {
        this.callbacks.push(callback);
    }

    private notify(change: RecentChange): void {
        this.callbacks.forEach(cb => cb(change));
    }

    public getStatus(): boolean {
        return this.eventSource !== null && this.eventSource.readyState === 1;
    }
}
