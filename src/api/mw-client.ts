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
        
        // S'assurer qu'on a un jeton pour les actions de modification
        if (!params.token) {
            try {
                params.token = await this.api.getEditToken();
            } catch (e) {
                // Fallback pour les anciennes versions ou configurations spécifiques
                const tokenRes = await this.api.get({ action: 'query', meta: 'tokens' });
                params.token = tokenRes.query?.tokens?.csrftoken;
            }
        }
        
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

    /**
     * Signale un utilisateur sur Wikipédia:Vandalisme en cours (VEC)
     * @param username Nom de l'utilisateur à signaler
     * @param reason Motif du signalement
     * @param diffUrl Lien vers le diff (optionnel)
     */
    public async reportToVEC(username: string, reason: string, diffUrl?: string): Promise<any> {
        if (!username || !reason) {
            throw new Error('Username and reason are required for reporting');
        }
        
        const pageTitle = 'Wikipédia:Vandalisme en cours';
        let text = `\n\n==Demande de blocage de ${username}==\n\n` +
                     `<!-- Remplacez « XXXX » par le compte temporaire ou le nom du contributeur auteur du vandalisme, ainsi que les « … » par les informations adéquates -->\n` +
                     `* Auteur du vandalisme : {{u+|${username}}}\n` +
                     `* Type de dégâts : ${reason}\n`;
        
        if (diffUrl) {
            text += `* Différence : ${diffUrl}\n`;
        }
        
        text += `\n<!-- Merci de ne pas modifier la ligne ci-dessous -->\n` +
                `Message déposé par --~~~~`;
        
        const result = await this.post({
            action: 'edit',
            title: pageTitle,
            appendtext: text,
            summary: `Signalement de [[Special:Contributions/${username}|${username}]] (${reason})`
        });
        
        if (!result || result.error) {
            throw new Error(result?.error?.info || 'Failed to report to VEC');
        }
        
        return result;
    }
}
