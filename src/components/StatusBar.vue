<script setup lang="ts">
import { computed } from 'vue';
import { state } from '@/core/state-manager';
import { CdxButton, CdxIcon } from '@wikimedia/codex';
import { cdxIconHistory, cdxIconCheckAll, cdxIconBlock, cdxIconBell } from '@wikimedia/codex-icons';

const elapsedTime = computed(() => {
    const diff = Math.floor((Date.now() - state.sessionStats.startTime) / 60000);
    return diff > 0 ? `${diff} min` : 'moins de 1 min';
});

const clearNotifications = () => {
    state.notifications = [];
};
</script>

<template>
  <div class="status-bar cdx-docs-status-bar">
    <div class="stats-section">
      <span class="stat-item" title="Modifications marquées comme lues">
        <cdx-icon :icon="cdxIconCheckAll" size="small" /> {{ state.sessionStats.patrolled }} relues
      </span>
      <span class="stat-item" title="Annulations effectuées">
        <cdx-icon :icon="cdxIconBlock" size="small" /> {{ state.sessionStats.reverts }} révocations
      </span>
      <span class="stat-item">
        ⏱ {{ elapsedTime }}
      </span>
    </div>

    <div class="notifications-section">
      <div v-if="state.notifications.length > 0" class="notif-wrapper" :class="state.notifications[0].type">
        <cdx-icon :icon="cdxIconBell" size="small" />
        <span class="notif-text">
          {{ state.notifications[0].text }}
        </span>
        <cdx-button weight="quiet" action="destructive" size="small" @click="clearNotifications">×</cdx-button>
      </div>
      <span v-else class="no-notif">LiveRC v2 prêt</span>
    </div>

    <div class="history-section">
      <cdx-button size="small" weight="quiet">
        <template #icon><cdx-icon :icon="cdxIconHistory" /></template>
        Historique ({{ state.history.length }})
      </cdx-button>
    </div>
  </div>
</template>

<style scoped>
@import '@wikimedia/codex/dist/codex.style.css';

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  background: #f8f9fa; /* Fond clair Codex par défaut */
  color: #202122;
  font-size: 0.85em;
  border-top: 1px solid #a2a9b1;
}

.stats-section, .history-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #54595d;
}

.notifications-section {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.notif-wrapper {
  padding: 2px 12px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #a2a9b1;
}

.notif-wrapper.success { background-color: #d5fdf4; border-color: #14866d; color: #14866d; }
.notif-wrapper.alert { background-color: #fef6e7; border-color: #ac6600; color: #ac6600; }
.notif-wrapper.message { background-color: #eaecf0; border-color: #36c; color: #36c; }

.no-notif {
  color: #72777d;
  font-style: italic;
}
</style>
