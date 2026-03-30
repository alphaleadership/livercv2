<script setup lang="ts">
import { ref, watch } from 'vue';
import { state, markAsReviewed } from '@/core/state-manager';
import { MWClient } from '@/api/mw-client';

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
</script>

<template>
  <div class="diff-preview-container component-content">
    <div v-if="state.selectedChange" class="diff-wrapper">
      <div class="diff-header">
        <h3>{{ state.selectedChange.title }}</h3>
        <div class="diff-meta">
            Par <strong>{{ state.selectedChange.user }}</strong> le {{ new Date(state.selectedChange.meta.dt).toLocaleString() }}
        </div>
        <div class="diff-actions">
          <button @click="onMarkAsReviewed" class="patrol-btn">Marquer comme relu</button>
          <button>Annuler</button>
          <button>Révoquer</button>
        </div>
      </div>
      
      <div class="diff-body" :class="{ 'loading': isLoading }">
          <div v-if="isLoading" class="spinner">Chargement...</div>
          <table v-else class="diff-table">
              <tbody v-html="diffHtml"></tbody>
          </table>
      </div>
    </div>
    <div v-else class="no-selection">
        Sélectionnez une modification dans la liste pour voir le diff.
    </div>
  </div>
</template>

<style scoped>
.diff-preview-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.diff-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.diff-header {
    border-bottom: 1px solid #444;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.diff-meta {
    font-size: 0.9em;
    color: #bbb;
    margin-bottom: 10px;
}

.diff-actions {
    display: flex;
    gap: 10px;
}

.patrol-btn {
    background-color: #00af89;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    font-weight: bold;
}

.diff-body {
    flex: 1;
    background: #f8f9fa; /* MediaWiki diff style background */
    color: black;
    padding: 10px;
    overflow-y: auto;
    font-family: sans-serif;
}

.diff-body.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.no-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #777;
    font-style: italic;
}

/* Styles pour la table de diff MediaWiki */
:deep(.diff-table) {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 13px;
}

:deep(.diff-addedline) {
    background: #eaf3ff;
    border-color: #adb3b9;
}

:deep(.diff-deletedline) {
    background: #feeec8;
    border-color: #adb3b9;
}

:deep(.diff-context) {
    background: #f8f9fa;
    border-color: #adb3b9;
}

:deep(.diffchange) {
    font-weight: bold;
    text-decoration: none;
}

:deep(.diff-addedline .diffchange) {
    background: #d8ecff;
}

:deep(.diff-deletedline .diffchange) {
    background: #fee7a0;
}
</style>
