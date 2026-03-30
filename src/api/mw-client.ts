/**
 * Client API MediaWiki adapté pour fonctionner en tant que Gadget
 */
export class MWClient {
    private api: any;

    constructor() {
        // @ts-ignore - mw est fourni par l'environnement MediaWiki
        if (typeof mw !== 'undefined' && mw.Api) {
            this.api = new mw.Api();
        } else {
            console.warn('mw.Api non trouvé, mode standalone dégradé');
        }
    }

    public async get(params: Record<string, any>): Promise<any> {
        if (!this.api) return fetch(params.apiUrl).then(r => r.json());
        return await this.api.get(params);
    }

    public async post(params: Record<string, any>): Promise<any> {
        if (!this.api) throw new Error('Action POST impossible hors MediaWiki');
        return await this.api.post(params);
    }

    public async getDiff(fromid: number, toid: number): Promise<string> {
        const result = await this.get({
            action: 'compare',
            fromrev: fromid,
            torev: toid,
            prop: 'diff'
        });
        return result.compare?.['*'] || '';
    }

    public async getUserInfo(username: string): Promise<any> {
        const result = await this.get({
            action: 'query',
            list: 'users',
            ususers: username,
            usprop: 'editcount|registration|groups|blockinfo'
        });
        return result.query?.users?.[0] || null;
    }

    public async undo(title: string, undoRev: number, summary: string): Promise<any> {
        return await this.post({
            action: 'edit',
            title: title,
            undo: undoRev,
            summary: summary,
            // Le jeton est géré automatiquement par mw.Api
        });
    }

    public async block(username: string, expiry: string, reason: string): Promise<any> {
        return await this.post({
            action: 'block',
            user: username,
            expiry: expiry,
            reason: reason
        });
    }
}
