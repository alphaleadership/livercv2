<script setup lang="ts">
import { computed } from 'vue';
import { state } from '@/core/state-manager';

const elapsedTime = computed(() => {
    const diff = Math.floor((Date.now() - state.sessionStats.startTime) / 60000);
    return diff > 0 ? `${diff} min` : 'moins de 1 min';
});

const clearNotifications = () => {
    state.notifications = [];
};
</script>

<template>
  <div class="status-bar">
    <div class="stats-section">
      <span class="stat-item" title="Modifications marquées comme lues">
        ✅ {{ state.sessionStats.patrolled }} relues
      </span>
      <span class="stat-item" title="Annulations effectuées">
        🚫 {{ state.sessionStats.reverts }} révocations
      </span>
      <span class="stat-item">
        ⏱ Session : {{ elapsedTime }}
      </span>
    </div>

    <div class="notifications-section">
      <div v-if="state.notifications.length > 0" class="notif-wrapper">
        <span class="notif-text" :class="state.notifications[0].type">
          🔔 {{ state.notifications[0].text }}
        </span>
        <button @click="clearNotifications" class="close-notif">×</button>
      </div>
      <span v-else class="no-notif">Prêt à patrouiller</span>
    </div>

    <div class="history-section">
      <button class="history-btn">📚 Historique ({{ state.history.length }})</button>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-size: 0.85em;
  border-top: 1px solid #444;
}

.stats-section, .history-section {
  display: flex;
  gap: 15px;
  align-items: center;
}

.stat-item {
  color: #ccc;
}

.notifications-section {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.notif-wrapper {
  background: #3d3d3d;
  padding: 2px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid #a7d7f9;
}

.notif-text.alert { color: #ffeb3b; }
.notif-text.success { color: #00af89; }
.notif-text.message { color: #a7d7f9; }

.close-notif {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0 2px;
}

.history-btn {
  background: #444;
  border: none;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
}

.history-btn:hover {
  background: #555;
}

.no-notif {
  color: #777;
  font-style: italic;
}
</style>
