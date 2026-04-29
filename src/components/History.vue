<script setup lang="ts">
import { state, selectChange } from '@/core/state-manager';
import { CdxIcon } from '@wikimedia/codex';
import { cdxIconHistory, cdxIconArticle } from '@wikimedia/codex-icons';

const onRowClick = (change: any) => {
    selectChange(change);
};
</script>

<template>
  <div class="history-container">
    <div class="history-header">
      <cdx-icon :icon="cdxIconHistory" />
      <h3>Historique de session</h3>
    </div>
    <div class="history-list">
      <div v-for="change in state.history" 
           :key="change.meta.id" 
           class="history-item"
           @click="onRowClick(change)">
        <cdx-icon :icon="cdxIconArticle" size="x-small" />
        <span class="item-title">{{ change.title }}</span>
        <span class="item-user">{{ change.user }}</span>
      </div>
      <div v-if="state.history.length === 0" class="empty-history">
        Aucun historique pour le moment.
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  padding: 16px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecf0;
  padding-bottom: 8px;
}

.history-header h3 { margin: 0; }

.history-list {
  flex: 1;
  overflow-y: auto;
}

.history-item {
  padding: 8px;
  border-bottom: 1px solid #eaecf0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.history-item:hover {
  background: #f8f9fa;
}

.item-title {
  flex: 1;
  font-weight: bold;
  color: #36c;
}

.item-user {
  color: #72777d;
  font-size: 0.85em;
}

.empty-history {
  padding: 20px;
  text-align: center;
  color: #72777d;
}
</style>
