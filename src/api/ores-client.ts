export interface ORESScores {
    [revid: number]: {
        [model: string]: {
            score?: {
                prediction: boolean | string;
                probability: {
                    [label: string]: number;
                };
            };
            error?: any;
        };
    };
}

export class ORESClient {
    private baseUrl: string = 'https://ores.wikimedia.org/v3/scores/';

    public async getScores(wiki: string, revids: number[], models: string[]): Promise<ORESScores> {
        if (revids.length === 0) return {};

        const revidsStr = revids.join('|');
        const modelsStr = models.join('|');
        const url = `${this.baseUrl}${wiki}/?revids=${revidsStr}&models=${modelsStr}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'LiveRCv2/0.1.0 (https://github.com/your-repo/livercv2)',
                },
            });

            if (!response.ok) {
                throw new Error(`ORES API error! status: ${response.status}`);
            }

            const data = await response.json();
            return data[wiki]?.scores || {};
        } catch (error) {
            console.error('ORES API Error:', error);
            throw error;
        }
    }
}
