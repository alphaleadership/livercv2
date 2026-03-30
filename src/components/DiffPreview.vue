<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { state, markAsReviewed, addNotification, incrementReverts } from '@/core/state-manager';
import { MWClient } from '@/api/mw-client';
import { keyboardManager } from '@/core/keyboard-manager';

const mwClient = new MWClient({ apiUrl: 'https://fr.wikipedia.org/w/api.php' });
const diffHtml = ref<string>('');
const isLoading = ref(false);

const fetchDiff = async () => {
    if (!state.selectedChange || !state.selectedChange.revision) {
        diffHtml.value = 'Pas de révision disponible pour ce changement.';
        return;
    }

    isLoading.value = true;
    try {
        const fromRev = state.selectedChange.revision.old || 0;
        const toRev = state.selectedChange.revision.new;
        
        // Si c'est une nouvelle page, on compare avec 0
        const html = await mwClient.getDiff(fromRev, toRev);
        diffHtml.value = html;
    } catch (error) {
        console.error('Failed to fetch diff:', error);
        diffHtml.value = 'Erreur lors de la récupération du diff.';
    } finally {
        isLoading.value = false;
    }
};

watch(() => state.selectedChange, () => {
    fetchDiff();
});

const onMarkAsReviewed = () => {
    if (state.selectedChange) {
        markAsReviewed(state.selectedChange.meta.id);
    }
};

const onUndo = async () => {
    // ... existant ...
};

const onTextSelect = () => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const text = selection.toString().trim();
    if (text.length > 3) {
        if (confirm(`Rechercher "${text.substring(0, 50)}..." sur le web ?`)) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
        }
    }
};

onMounted(() => {
    // ... existant ...
});
</script>

<template>
  <!-- ... existant ... -->
</template>

<style scoped>
/* ... styles existants ... */
.copyvio-btn {
    background-color: #f57c00;
    color: white;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 3px;
    font-size: 0.9em;
    display: flex;
    align-items: center;
}

.action-btn {
    background-color: #3d3d3d;
    color: #e0e0e0;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 3px;
    font-size: 0.9em;
}
</style>
