<script setup lang="ts">
import { ref, watch } from 'vue';
import { state } from '@/core/state-manager';
import { MWClient } from '@/api/mw-client';

const mwClient = new MWClient({ apiUrl: 'https://fr.wikipedia.org/w/api.php' });
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
</script>

<template>
  <div class="user-info-container component-content">
    <div v-if="state.selectedChange" class="user-wrapper">
      <div v-if="isLoading" class="loading">Chargement des données...</div>
      <div v-else-if="userDetails">
        <div class="user-header">
          <h3>{{ userDetails.name }}</h3>
          <div class="user-badges" v-if="userDetails.groups">
            <span v-for="group in userDetails.groups" :key="group" class="badge">
              {{ group }}
            </span>
          </div>
        </div>
        
        <div class="user-details">
          <p>📝 <strong>Contributions :</strong> {{ userDetails.editcount || 0 }}</p>
          <p>📅 <strong>Inscription :</strong> {{ formatDate(userDetails.registration) }}</p>
          <p v-if="userDetails.blockedby" class="blocked-status">
            🚫 <strong>BLOQUÉ</strong> par {{ userDetails.blockedby }}
            <br><small>Motif : {{ userDetails.blockreason }}</small>
          </p>
        </div>
        
        <div class="user-actions">
          <a :href="`https://fr.wikipedia.org/wiki/Special:Contributions/${userDetails.name}`" target="_blank" class="action-btn">Contribs</a>
          <a :href="`https://fr.wikipedia.org/wiki/User_talk:${userDetails.name}`" target="_blank" class="action-btn">PDD</a>
          <button class="block-btn" v-if="!userDetails.blockedby">Bloquer</button>
        </div>
      </div>
      <div v-else class="error">Impossible de charger les données de l'utilisateur.</div>
    </div>
    <div v-else class="no-selection">
        Sélectionnez une modification pour voir les infos utilisateur.
    </div>
  </div>
</template>

<style scoped>
.user-info-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-wrapper {
  height: 100%;
}

.user-header {
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.badge {
  background: #3d3d3d;
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 5px;
  color: #a7d7f9;
}

.user-details p {
  margin: 8px 0;
}

.blocked-status {
  color: #d33;
  padding: 8px;
  background: rgba(211, 47, 47, 0.1);
  border: 1px solid #d33;
  border-radius: 4px;
}

.user-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.action-btn {
  background: #3d3d3d;
  color: #e0e0e0;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.9em;
}

.block-btn {
  background-color: #d33;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
}

.no-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #777;
    font-style: italic;
}
</style>
