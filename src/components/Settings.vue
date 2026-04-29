<script setup lang="ts">
import { ref } from 'vue';
import { DEFAULT_FILTERS } from '@/types/filters';
import { CdxButton, CdxIcon, CdxToggleSwitch } from '@wikimedia/codex';
import { cdxIconSettings } from '@wikimedia/codex-icons';

const savedFilters = localStorage.getItem('liverc_filters');
const filters = ref(savedFilters ? JSON.parse(savedFilters) : { ...DEFAULT_FILTERS });

const save = () => {
    localStorage.setItem('liverc_filters', JSON.stringify(filters.value));
    alert('Réglages enregistrés (nécessite un redémarrage pour certains filtres)');
};
</script>

<template>
  <div class="settings-container">
    <div class="settings-header">
      <cdx-icon :icon="cdxIconSettings" />
      <h3>Réglages</h3>
    </div>
    
    <div class="settings-body">
      <div class="setting-item">
        <cdx-toggle-switch v-model="filters.showIP">Afficher les IP</cdx-toggle-switch>
      </div>
      <div class="setting-item">
        <cdx-toggle-switch v-model="filters.showBots">Afficher les bots</cdx-toggle-switch>
      </div>
      <div class="setting-item">
        <cdx-toggle-switch v-model="filters.showNewPages">Afficher les nouvelles pages</cdx-toggle-switch>
      </div>
      
      <div class="save-actions">
        <cdx-button action="progressive" weight="primary" @click="save">Enregistrer</cdx-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 16px;
  background: white;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.settings-header h3 { margin: 0; }

.setting-item {
  margin-bottom: 16px;
}

.save-actions {
  margin-top: 32px;
}
</style>
