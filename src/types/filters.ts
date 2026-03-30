export interface FilterCriteria {
    showIP: boolean;
    showRegistered: boolean;
    showBots: boolean;
    showNewPages: boolean;
    showEdits: boolean;
    minEditCount?: number;
    maxAccountAgeDays?: number;
    namespaces: number[]; // Liste des IDs d'espaces de noms à afficher
    minOresDamagingScore?: number;
    whitelist: string[]; // Noms d'utilisateurs
    blacklist: string[]; // Noms d'utilisateurs
}

export const DEFAULT_FILTERS: FilterCriteria = {
    showIP: true,
    showRegistered: true,
    showBots: false,
    showNewPages: true,
    showEdits: true,
    namespaces: [0], // Par défaut, uniquement l'espace principal (articles)
    whitelist: [],
    blacklist: []
};
