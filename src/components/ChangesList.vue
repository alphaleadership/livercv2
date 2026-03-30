<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { EventStreamManager } from '@/core/event-stream-manager';
import { FilterManager } from '@/core/filter-manager';
import { RecentChange } from '@/types/mediawiki-events';
import { DEFAULT_FILTERS, FilterCriteria } from '@/types/filters';
import { state, selectChange } from '@/core/state-manager';
import { keyboardManager } from '@/core/keyboard-manager';

interface ChangeEntry extends RecentChange {
  formattedTime: string;
  diffSize: number;
}

const changes = ref<ChangeEntry[]>([]);
const isPaused = ref(false);
const streamManager = new EventStreamManager(['frwiki']);

// Gestion des filtres avec persistance
const savedFilters = localStorage.getItem('liverc_filters');
const initialFilters: FilterCriteria = savedFilters ? JSON.parse(savedFilters) : DEFAULT_FILTERS;
const filterManager = new FilterManager(initialFilters);
const currentFilters = ref<FilterCriteria>(initialFilters);

const formatTime = (dt: string) => {
    const date = new Date(dt);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const handleNewChange = (rc: RecentChange) => {
    if (!filterManager.shouldShowChange(rc)) return;

    const newEntry: ChangeEntry = {
        ...rc,
        formattedTime: formatTime(rc.meta.dt),
        diffSize: (rc.length?.new ?? 0) - (rc.length?.old ?? 0)
    };

    changes.value.unshift(newEntry);
    if (changes.value.length > 500) {
        changes.value.pop();
    }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
      streamManager.pause();
  } else {
      streamManager.resume();
  }
};

const clearList = () => {
  changes.value = [];
};

const onRowClick = (change: ChangeEntry) => {
    selectChange(change);
};

const selectNext = () => {
    if (changes.value.length === 0) return;
    if (!state.selectedChange) {
        selectChange(changes.value[0]);
        return;
    }
    const currentIndex = changes.value.findIndex(c => c.meta.id === state.selectedChange?.meta.id);
    if (currentIndex < changes.value.length - 1) {
        selectChange(changes.value[currentIndex + 1]);
    }
};

const selectPrevious = () => {
    if (!state.selectedChange || changes.value.length === 0) return;
    const currentIndex = changes.value.findIndex(c => c.meta.id === state.selectedChange?.meta.id);
    if (currentIndex > 0) {
        selectChange(changes.value[currentIndex - 1]);
    }
};

watch(currentFilters, (newVal) => {
    filterManager.updateCriteria(newVal);
    localStorage.setItem('liverc_filters', JSON.stringify(newVal));
}, { deep: true });

onMounted(() => {
    streamManager.onNewChange(handleNewChange);
    streamManager.connect();
    keyboardManager.register({ key: 'ArrowDown', description: 'Suivant', handler: selectNext });
    keyboardManager.register({ key: 'ArrowUp', description: 'Précédent', handler: selectPrevious });
});

onUnmounted(() => {
    streamManager.disconnect();
    keyboardManager.unregisterAll();
});
</script>

<template>
  <div class="changes-list-container">
    <div class="toolbar">
      <button @click="togglePause">{{ isPaused ? 'Reprendre' : 'Pause' }}</button>
      <button @click="clearList">Vider</button>
      <span class="status">{{ isPaused ? '⏸ En pause' : '▶ En direct' }}</span>
    </div>
    
    <div class="list-wrapper">
      <table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>Page</th>
            <th>Utilisateur</th>
            <th>Diff</th>
            <th>Résumé</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="change in changes" 
              :key="change.meta.id" 
              class="change-row"
              :class="{ 
                  'selected': state.selectedChange?.meta.id === change.meta.id,
                  'reviewed': state.reviewedIds.has(change.meta.id)
              }"
              @click="onRowClick(change)">
            <td>{{ change.formattedTime }}</td>
            <td class="page-title">{{ change.title }}</td>
            <td>{{ change.user }}</td>
            <td :class="change.diffSize > 0 ? 'diff-plus' : 'diff-minus'">
              {{ change.diffSize > 0 ? '+' : '' }}{{ change.diffSize }}
            </td>
            <td class="summary">{{ change.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.changes-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  padding: 5px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
  display: flex;
  gap: 10px;
  align-items: center;
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 8px;
  background: #333;
  position: sticky;
  top: 0;
}

td {
  padding: 6px 8px;
  border-bottom: 1px solid #333;
}

.change-row:hover {
  background: #2a2a2a;
  cursor: pointer;
}

.change-row.selected {
  background: #3d3d3d;
  border-left: 3px solid #a7d7f9;
}

.change-row.reviewed {
  opacity: 0.6;
}

.change-row.reviewed td {
  text-decoration: line-through #555;
}

.page-title {
  color: #a7d7f9;
  font-weight: bold;
}

.diff-plus { color: #00af89; }
.diff-minus { color: #d33; }
.summary { font-style: italic; font-size: 0.9em; }
.status { font-size: 0.8em; margin-left: auto; }
</style>
