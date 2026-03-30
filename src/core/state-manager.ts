import { reactive } from 'vue';
import { RecentChange } from '@/types/mediawiki-events';

interface AppState {
    selectedChange: RecentChange | null;
    reviewedIds: Set<string>;
    sessionStats: {
        reverts: number;
        patrolled: number;
    };
}

export const state = reactive<AppState>({
    selectedChange: null,
    reviewedIds: new Set(),
    sessionStats: {
        reverts: 0,
        patrolled: 0
    }
});

export const selectChange = (change: RecentChange) => {
    state.selectedChange = change;
};

export const markAsReviewed = (id: string) => {
    state.reviewedIds.add(id);
    state.sessionStats.patrolled++;
};
