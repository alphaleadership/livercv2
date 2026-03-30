<script setup lang="ts">
import { CdxButton, CdxIcon } from '@wikimedia/codex';
import { cdxIconListBullet, cdxIconSettings, cdxIconChart, cdxIconUserGroup } from '@wikimedia/codex-icons';
import { ref } from 'vue';

const selectedId = ref('changes');

const items = [
    { id: 'changes', label: 'Modifs', icon: cdxIconListBullet },
    { id: 'users', label: 'Contributeurs', icon: cdxIconUserGroup },
    { id: 'stats', label: 'Stats', icon: cdxIconChart },
    { id: 'settings', label: 'Réglages', icon: cdxIconSettings }
];

const select = (id: string) => {
    selectedId.value = id;
    // Ici on pourra ajouter la logique pour changer de vue si besoin
};
</script>

<template>
  <div class="sidebar-simple">
    <div v-for="item in items" :key="item.id" class="nav-item">
      <cdx-button 
        weight="quiet" 
        :action="selectedId === item.id ? 'progressive' : 'default'"
        @click="select(item.id)"
        class="nav-button"
      >
        <template #icon><cdx-icon :icon="item.icon" /></template>
        <span class="nav-label">{{ item.label }}</span>
      </cdx-button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-simple {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: #f8f9fa;
  height: 100%;
}

.nav-item {
  width: 100%;
}

.nav-button {
  width: 100%;
  justify-content: flex-start !important;
}

.nav-label {
  margin-left: 8px;
}

@media (max-width: 800px) {
  .nav-label {
    display: none;
  }
}
</style>
