<script setup lang="ts">
import { ref, watch } from 'vue';
import { state, addNotification } from '@/core/state-manager';
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

const onBlock = async () => {
    if (!userDetails.value) return;

    const username = userDetails.value.name;
    const expiry = prompt(`Durée du blocage pour ${username} (ex: 24 hours, infinite) :`, '24 hours');
    if (!expiry) return;

    const reason = prompt(`Motif du blocage pour ${username} :`, 'Vandalisme répété');
    if (!reason) return;

    try {
        const result = await mwClient.block(username, expiry, reason);
        if (result.block) {
            addNotification(`Utilisateur ${username} bloqué pour ${expiry}`, 'success');
            fetchUserInfo(); // Rafraîchir les infos pour voir le statut bloqué
        } else if (result.error) {
            addNotification(`Erreur de blocage : ${result.error.info}`, 'alert');
        }
    } catch (error) {
        console.error('Block failed:', error);
        addNotification('Échec de la requête de blocage.', 'alert');
    }
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
          <p v-if="userDetails.blockid" class="blocked-status">
            🚫 <strong>BLOQUÉ</strong> par {{ userDetails.blockedby }}
            <br><small>Motif : {{ userDetails.blockreason }}</small>
          </p>
        </div>
        
        <div class="user-actions">
          <a :href="`https://fr.wikipedia.org/wiki/Special:Contributions/${userDetails.name}`" target="_blank" class="action-btn">Contribs</a>
          <a :href="`https://fr.wikipedia.org/wiki/User_talk:${userDetails.name}`" target="_blank" class="action-btn">PDD</a>
          <template v-if="isIP(userDetails.name)">
            <a :href="`https://whois.toolforge.org/gateway.py?lookup=true&ip=${userDetails.name}`" target="_blank" class="action-btn whois-btn">Whois</a>
            <a :href="`https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${userDetails.name}`" target="_blank" class="action-btn ipqs-btn">Proxy Check</a>
          </template>
          <button @click="onBlock" class="block-btn" v-if="!userDetails.blockid">Bloquer</button>
        </div>
      </div>
      <div v-else class="error">Impossible de charger les données de l'utilisateur.</div>
    </div>
    <div v-else class="no-selection">
        Sélectionnez une modification pour voir les infos utilisateur.
    </div>
  </div>
</template>

<script setup lang="ts">
// ... imports existants ...

const isIP = (name: string): boolean => {
    if (!name) return false;
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipv6Regex = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
    return ipv4Regex.test(name) || ipv6Regex.test(name);
};
</script>

<style scoped>
/* ... styles existants ... */
.whois-btn { background-color: #4a148c; }
.ipqs-btn { background-color: #0d47a1; }
.action-btn:hover { opacity: 0.8; }
</style>

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
