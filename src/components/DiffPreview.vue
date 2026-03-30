<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { state, markAsReviewed, addNotification, incrementReverts } from '@/core/state-manager';
import { MWClient } from '@/api/mw-client';
import { keyboardManager } from '@/core/keyboard-manager';
import { CdxButton, CdxIcon, CdxProgressBar } from '@wikimedia/codex';
import { cdxIconCheck, cdxIconUndo, cdxIconAlert, cdxIconSearch } from '@wikimedia/codex-icons';

const mwClient = new MWClient();
const diffHtml = ref<string>('');
const isLoading = ref(false);

const fetchDiff = async () => {
    if (!state.selectedChange || !state.selectedChange.revision) {
        diffHtml.value = '<tr><td>Pas de révision disponible.</td></tr>';
        return;
    }

    isLoading.value = true;
    try {
        const fromRev = state.selectedChange.revision.old || 0;
        const toRev = state.selectedChange.revision.new || 0;
        const html = await mwClient.getDiff(fromRev, toRev);
        diffHtml.value = html;
    } catch (error) {
        diffHtml.value = '<tr><td>Erreur lors du chargement du diff.</td></tr>';
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
        addNotification('Marqué comme relu', 'success');
    }
};

const onUndo = async () => {
    if (!state.selectedChange || !state.selectedChange.revision) return;
    if (!confirm('Annuler cette modification ?')) return;

    try {
        const title = state.selectedChange.title;
        const revId = state.selectedChange.revision.new || 0;
        const summary = `Annulation de la modification ${revId} par ${state.selectedChange.user} (via LiveRCv2)`;
        
        const result = await mwClient.undo(title, revId, summary);
        
        if (result.edit && result.edit.result === 'Success') {
            addNotification('Modification annulée !', 'success');
            incrementReverts();
            markAsReviewed(state.selectedChange.meta.id);
        } else {
            addNotification(`Erreur : ${result.error?.info || 'Inconnue'}`, 'alert');
        }
    } catch (e) {
        addNotification('Échec de l\'action', 'alert');
    }
};

const onTextSelect = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 5) {
        if (confirm(`Rechercher "${selection.substring(0, 30)}..." ?`)) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, '_blank');
        }
    }
};

onMounted(() => {
    keyboardManager.register({ key: 'r', description: 'Relu', handler: onMarkAsReviewed });
    keyboardManager.register({ key: 'u', description: 'Annuler', handler: onUndo });
});
</script>

<template>
  <div class="diff-preview-container">
    <div v-if="state.selectedChange" class="diff-content">
      <div class="diff-toolbar">
        <div class="page-info">
          <strong>{{ state.selectedChange.title }}</strong>
          <span class="user-info">par {{ state.selectedChange.user }}</span>
        </div>
        <div class="actions-group">
          <cdx-button action="progressive" weight="primary" size="small" @click="onMarkAsReviewed">
            <template #icon><cdx-icon :icon="cdxIconCheck" /></template>
            Relu (r)
          </cdx-button>
          <cdx-button action="destructive" weight="quiet" size="small" @click="onUndo">
            <template #icon><cdx-icon :icon="cdxIconUndo" /></template>
            Annuler (u)
          </cdx-button>
          <cdx-button weight="quiet" size="small" 
            :href="`https://copyvios.toolforge.org/?lang=fr&project=wikipedia&title=${encodeURIComponent(state.selectedChange.title)}`" target="_blank">
            <template #icon><cdx-icon :icon="cdxIconSearch" /></template>
            Copyvio
          </cdx-button>
        </div>
      </div>

      <div class="diff-body" :class="{ 'is-loading': isLoading }" @mouseup="onTextSelect">
        <cdx-progress-bar v-if="isLoading" inline />
        <table class="diff-table">
          <tbody v-html="diffHtml"></tbody>
        </table>
      </div>
    </div>
    <div v-else class="empty-state">
      <cdx-icon :icon="cdxIconAlert" size="large" />
      <p>Sélectionnez une modification dans la liste de gauche.</p>
    </div>
  </div>
</template>

<style scoped>
.diff-preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  color: #202122;
}

.diff-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.diff-toolbar {
  padding: 8px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #a2a9b1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  margin-left: 12px;
  color: #72777d;
  font-size: 0.9em;
}

.actions-group {
  display: flex;
  gap: 8px;
}

.diff-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  font-family: sans-serif;
  background: #fff;
}

.diff-body.is-loading {
  opacity: 0.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #72777d;
}

/* Styles pour les tables de diff Wikipédia */
:deep(.diff-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
}
:deep(.diff-addedline) { background: #eaf3ff; border-color: #adb3b9; }
:deep(.diff-deletedline) { background: #feeec8; border-color: #adb3b9; }
:deep(.diff-context) { background: #f8f9fa; border-color: #adb3b9; }
:deep(.diffchange) { font-weight: bold; text-decoration: none; }
:deep(.diff-addedline .diffchange) { background: #d8ecff; }
:deep(.diff-deletedline .diffchange) { background: #fee7a0; }
</style>
