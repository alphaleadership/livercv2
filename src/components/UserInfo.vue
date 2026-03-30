<script setup lang="ts">
import { ref, watch } from 'vue';
import { state, addNotification } from '@/core/state-manager';
import { MWClient } from '@/api/mw-client';
import { CdxButton, CdxIcon, CdxThumbnail } from '@wikimedia/codex';
import { cdxIconUserGroup, cdxIconEdit, cdxIconCalendar, cdxIconBlock, cdxIconInfo } from '@wikimedia/codex-icons';

const mwClient = new MWClient();
const userDetails = ref<any>(null);
const isLoading = ref(false);

const fetchUserInfo = async () => {
    if (!state.selectedChange) return;
    
    isLoading.value = true;
    try {
        const username = state.selectedChange.user;
        const info = await mwClient.getUserInfo(username);
        userDetails.value = info;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        userDetails.value = null;
    } finally {
        isLoading.value = false;
    }
};

watch(() => state.selectedChange, () => {
    fetchUserInfo();
});

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Inconnue';
    return new Date(dateStr).toLocaleDateString('fr-FR');
};

const isIP = (name: string): boolean => {
    if (!name) return false;
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipv6Regex = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
    return ipv4Regex.test(name) || ipv6Regex.test(name);
};

const onBlock = async () => {
    if (!userDetails.value) return;
    const username = userDetails.value.name;
    const expiry = prompt(`Durée du blocage pour ${username} :`, '24 hours');
    if (!expiry) return;
    const reason = prompt(`Motif du blocage pour ${username} :`, 'Vandalisme répété');
    if (!reason) return;

    try {
        const result = await mwClient.block(username, expiry, reason);
        if (result.block) {
            addNotification(`Utilisateur ${username} bloqué`, 'success');
            fetchUserInfo();
        }
    } catch (e) {
        addNotification('Erreur lors du blocage', 'alert');
    }
};
</script>

<template>
  <div class="user-info-container component-content">
    <div v-if="state.selectedChange" class="user-wrapper">
      <div v-if="isLoading" class="loading">Chargement...</div>
      <div v-else-if="userDetails">
        <div class="user-header">
          <h3>
            <cdx-icon :icon="cdxIconUserGroup" />
            {{ userDetails.name }}
          </h3>
          <div class="user-badges">
            <span v-for="group in userDetails.groups" :key="group" class="cdx-docs-badge">
              {{ group }}
            </span>
          </div>
        </div>
        
        <div class="user-details-grid">
          <div class="detail-item">
            <cdx-icon :icon="cdxIconEdit" size="small" />
            <span><strong>{{ userDetails.editcount || 0 }}</strong> contributions</span>
          </div>
          <div class="detail-item">
            <cdx-icon :icon="cdxIconCalendar" size="small" />
            <span>Inscrit le {{ formatDate(userDetails.registration) }}</span>
          </div>
          <div v-if="userDetails.blockid" class="blocked-alert">
            <cdx-icon :icon="cdxIconBlock" color="error" />
            <strong>BLOQUÉ</strong> par {{ userDetails.blockedby }}
          </div>
        </div>
        
        <div class="user-actions">
          <cdx-button action="progressive" weight="quiet" 
            :href="`https://fr.wikipedia.org/wiki/Special:Contributions/${userDetails.name}`" target="_blank">
            Contributions
          </cdx-button>
          <cdx-button action="progressive" weight="quiet"
            :href="`https://fr.wikipedia.org/wiki/User_talk:${userDetails.name}`" target="_blank">
            Discussion
          </cdx-button>
          
          <template v-if="isIP(userDetails.name)">
            <cdx-button weight="quiet" :href="`https://whois.toolforge.org/gateway.py?lookup=true&ip=${userDetails.name}`" target="_blank">Whois</cdx-button>
          </template>
          
          <cdx-button action="destructive" weight="primary" v-if="!userDetails.blockid" @click="onBlock">
            <template #icon><cdx-icon :icon="cdxIconBlock" /></template>
            Bloquer
          </cdx-button>
        </div>
      </div>
    </div>
    <div v-else class="no-selection">
        <cdx-icon :icon="cdxIconInfo" size="large" />
        <p>Sélectionnez un contributeur</p>
    </div>
  </div>
</template>

<style scoped>
@import '@wikimedia/codex/dist/codex.style.css';

.user-info-container {
  padding: 16px;
  color: #202122;
  background: white;
}

.user-header h3 {
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
}

.cdx-docs-badge {
  background: #eaecf0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  color: #54595d;
}

.user-details-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #54595d;
}

.blocked-alert {
  padding: 12px;
  background: #fee7e6;
  border: 1px solid #d33;
  border-radius: 2px;
  color: #d33;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #72777d;
}
</style>
