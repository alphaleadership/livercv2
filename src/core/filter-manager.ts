import { FilterCriteria, DEFAULT_FILTERS } from '@/types/filters';
import { RecentChange } from '@/types/mediawiki-events';

export class FilterManager {
    private criteria: FilterCriteria;

    constructor(initialCriteria: FilterCriteria = DEFAULT_FILTERS) {
        this.criteria = { ...initialCriteria };
    }

    public updateCriteria(newCriteria: Partial<FilterCriteria>): void {
        this.criteria = { ...this.criteria, ...newCriteria };
    }

    public getCriteria(): FilterCriteria {
        return { ...this.criteria };
    }

    public shouldShowChange(rc: RecentChange): boolean {
        // Assertions de base
        if (!rc || !rc.type) return false;

        // Whitelist / Blacklist
        if (this.criteria.whitelist.includes(rc.user)) return true;
        if (this.criteria.blacklist.includes(rc.user)) return false;

        // Bot filtering
        if (!this.criteria.showBots && rc.bot) return false;

        // Type filtering
        if (rc.type === 'new' && !this.criteria.showNewPages) return false;
        if (rc.type === 'edit' && !this.criteria.showEdits) return false;

        // Namespace filtering
        if (this.criteria.namespaces.length > 0 && !this.criteria.namespaces.includes(rc.namespace)) {
            return false;
        }

        // IP vs Registered filtering
        const isIP = this.isUserIP(rc.user);
        if (isIP && !this.criteria.showIP) return false;
        if (!isIP && !this.criteria.showRegistered) return false;

        // Note: Les critères plus avancés (score ORES, editCount, accountAge) 
        // demandent des appels API complémentaires et seront gérés par une étape ultérieure
        // d'enrichissement des données.

        return true;
    }

    private isUserIP(user: string): boolean {
        // Simple regex pour IPv4 et IPv6
        const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        const ipv6Regex = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
        return ipv4Regex.test(user) || ipv6Regex.test(user);
    }
}
