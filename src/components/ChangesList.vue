<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { EventStreamManager } from '@/core/event-stream-manager';
import { FilterManager } from '@/core/filter-manager';
import { RecentChange } from '@/types/mediawiki-events';
import { DEFAULT_FILTERS, FilterCriteria } from '@/types/filters';
import { state, selectChange } from '@/core/state-manager';
import { keyboardManager } from '@/core/keyboard-manager';
import { CdxButton, CdxIcon } from '@wikimedia/codex';
import { cdxIconPause, cdxIconPlay, cdxIconClear, cdxIconArticle } from '@wikimedia/codex-icons';

interface ChangeEntry extends RecentChange {
  formattedTime: string;
  diffSize: number;
}

const changes = ref<ChangeEntry[]>([]);
const isPaused = ref(false);
const streamManager = new EventStreamManager(['frwiki']);

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
    if (changes.value.length > 500) changes.value.pop();
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) streamManager.pause();
  else streamManager.resume();
};

const clearList = () => {
  changes.value = [];
};

const onRowClick = (change: ChangeEntry) => {
    selectChange(change);
};

const selectNext = () => {
    if (changes.value.length === 0) return;
    const currentIndex = state.selectedChange ? changes.value.findIndex(c => c.meta.id === state.selectedChange?.meta.id) : -1;
    if (currentIndex < changes.value.length - 1) selectChange(changes.value[currentIndex + 1]);
};

const selectPrevious = () => {
    if (!state.selectedChange || changes.value.length === 0) return;
    const currentIndex = changes.value.findIndex(c => c.meta.id === state.selectedChange?.meta.id);
    if (currentIndex > 0) selectChange(changes.value[currentIndex - 1]);
};

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
      <cdx-button size="small" @click="togglePause" :weight="isPaused ? 'primary' : 'quiet'">
        <template #icon><cdx-icon :icon="isPaused ? cdxIconPlay : cdxIconPause" /></template>
        {{ isPaused ? 'Reprendre' : 'Pause' }}
      </cdx-button>
      <cdx-button size="small" weight="quiet" @click="clearList">
        <template #icon><cdx-icon :icon="cdxIconClear" /></template>
        Vider
      </cdx-button>
      <span class="status-badge" :class="{ 'paused': isPaused }">
        {{ isPaused ? 'Flux arrêté' : 'Flux en direct' }}
      </span>
    </div>
    
    <div class="list-wrapper">
      <table class="cdx-docs-table">
        <thead>
          <tr>
            <th class="col-time">Heure</th>
            <th class="col-page">Page</th>
            <th class="col-user">Contributeur</th>
            <th class="col-diff">±</th>
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
            <td class="col-time">{{ change.formattedTime }}</td>
            <td class="col-page">
              <cdx-icon :icon="cdxIconArticle" size="x-small" />
              {{ change.title }}
            </td>
            <td class="col-user">{{ change.user }}</td>
            <td class="col-diff" :class="change.diffSize > 0 ? 'diff-plus' : 'diff-minus'">
              {{ change.diffSize > 0 ? '+' : '' }}{{ change.diffSize }}
            </td>
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
  background: white;
}

.toolbar {
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid #a2a9b1;
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-badge {
  margin-left: auto;
  font-size: 0.75em;
  color: #14866d;
  font-weight: bold;
}

.status-badge.paused { color: #d33; }

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}

.cdx-docs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

th {
  text-align: left;
  padding: 12px 8px;
  background: #eaecf0;
  color: #202122;
  position: sticky;
  top: 0;
  z-index: 1;
}

td {
  padding: 8px;
  border-bottom: 1px solid #eaecf0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.change-row:hover {
  background: #f8f9fa;
  cursor: pointer;
}

.change-row.selected {
  background: #eaf3ff;
  border-left: 4px solid #36c;
}

.change-row.reviewed {
  opacity: 0.5;
}

.col-time { width: 80px; color: #72777d; }
.col-page { color: #36c; font-weight: bold; }
.col-user { width: 120px; }
.col-diff { width: 60px; font-weight: bold; text-align: right; }

.diff-plus { color: #14866d; }
.diff-minus { color: #d33; }
</style>
