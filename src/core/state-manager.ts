import { reactive } from 'vue';
import { RecentChange } from '@/types/mediawiki-events';

interface AppNotification {
    id: string;
    type: 'message' | 'alert' | 'success';
    text: string;
    timestamp: number;
}

interface AppState {
    selectedChange: RecentChange | null;
    reviewedIds: Set<string>;
    history: RecentChange[];
    notifications: AppNotification[];
    sessionStats: {
        reverts: number;
        patrolled: number;
        startTime: number;
    };
}

export const state = reactive<AppState>({
    selectedChange: null,
    reviewedIds: new Set(),
    history: [],
    notifications: [],
    sessionStats: {
        reverts: 0,
        patrolled: 0,
        startTime: Date.now()
    }
});

export const selectChange = (change: RecentChange) => {
    state.selectedChange = change;
    // Ajouter à l'historique si pas déjà présent
    if (!state.history.find(c => c.meta.id === change.meta.id)) {
        state.history.unshift(change);
        if (state.history.length > 100) state.history.pop();
    }
};

export const markAsReviewed = (id: string) => {
    if (!state.reviewedIds.has(id)) {
        state.reviewedIds.add(id);
        state.sessionStats.patrolled++;
    }
};

export const addNotification = (text: string, type: AppNotification['type'] = 'alert') => {
    const id = Math.random().toString(36).substring(7);
    state.notifications.push({ id, text, type, timestamp: Date.now() });
    // Auto-suppression après 10 secondes
    setTimeout(() => {
        state.notifications = state.notifications.filter(n => n.id !== id);
    }, 10000);
};

export const incrementReverts = () => {
    state.sessionStats.reverts++;
};
