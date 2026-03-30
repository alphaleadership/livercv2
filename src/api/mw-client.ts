export interface MWConfig {
    apiUrl: string;
    consumerKey?: string;
    consumerSecret?: string;
    accessToken?: string;
    accessSecret?: string;
}

export class MWClient {
    private config: MWConfig;

    constructor(config: MWConfig) {
        this.config = config;
        this.validateConfig();
    }

    private validateConfig() {
        if (!this.config.apiUrl) {
            throw new Error('API URL is required');
        }
    }

    public async get(params: Record<string, string | number | boolean>): Promise<any> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            queryParams.append(key, String(value));
        });
        
        // Default params
        if (!queryParams.has('format')) queryParams.append('format', 'json');
        if (!queryParams.has('origin')) queryParams.append('origin', '*');

        const url = `${this.config.apiUrl}?${queryParams.toString()}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('MW API Get Error:', error);
            throw error;
        }
    }

    public async post(params: Record<string, string | number | boolean>): Promise<any> {
        const body = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            body.append(key, String(value));
        });

        if (!body.has('format')) body.append('format', 'json');

        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    ...this.getHeaders(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('MW API Post Error:', error);
            throw error;
        }
    }

    public async getDiff(fromid: number, toid: number): Promise<string> {
        const params = {
            action: 'compare',
            fromrev: fromid,
            torev: toid,
            prop: 'diff',
            format: 'json',
            origin: '*'
        };

        const result = await this.get(params);
        if (result.compare && result.compare['*']) {
            return result.compare['*'];
        }
        throw new Error('Could not fetch diff');
    }

    public async getUserInfo(username: string): Promise<any> {
        const params = {
            action: 'query',
            list: 'users',
            ususers: username,
            usprop: 'editcount|registration|groups|blockinfo',
            format: 'json',
            origin: '*'
        };

        const result = await this.get(params);
        if (result.query && result.query.users && result.query.users[0]) {
            return result.query.users[0];
        }
        throw new Error(`Could not fetch info for user ${username}`);
    }

    /**
     * Récupère un jeton (token) pour une action spécifique (edit, block, etc.)
     */
    public async getToken(type: string = 'csrf'): Promise<string> {
        const params = {
            action: 'query',
            meta: 'tokens',
            type: type,
            format: 'json',
            origin: '*'
        };

        const result = await this.get(params);
        if (result.query && result.query.tokens) {
            return result.query.tokens[`${type}token`];
        }
        throw new Error(`Could not fetch ${type} token`);
    }

    /**
     * Annule une modification (undo)
     */
    public async undo(title: string, undoRev: number, summary: string): Promise<any> {
        const token = await this.getToken();
        const params = {
            action: 'edit',
            title: title,
            undo: undoRev,
            summary: summary,
            token: token,
            format: 'json',
            origin: '*'
        };

        return await this.post(params);
    }

    /**
     * Bloque un utilisateur (Admins uniquement)
     */
    public async block(username: string, expiry: string, reason: string): Promise<any> {
        const token = await this.getToken('csrf'); // MediaWiki utilise CSRF pour le blocage aussi
        const params = {
            action: 'block',
            user: username,
            expiry: expiry,
            reason: reason,
            token: token,
            format: 'json',
            origin: '*'
        };

        return await this.post(params);
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Api-User-Agent': 'LiveRCv2/0.1.0 (https://github.com/your-repo/livercv2)',
        };

        // TODO: Implement OAuth 1.0a or 2.0 header generation here
        // For now, we assume simple API access or session-based if on same domain
        
        return headers;
    }
}
