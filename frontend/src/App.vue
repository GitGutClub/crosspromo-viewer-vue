<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <!-- Заголовок -->
        <v-row class="mb-6">
          <v-col cols="12">
            <h2 class="text-center">Crosspromo Assets Viewer</h2>
          </v-col>
        </v-row>

        <!-- Фильтры -->
        <v-row class="mb-4" align="center" dense>
          <v-col cols="12" md="3">
            <v-text-field 
              label="StoreCode" 
              v-model="filters.storeCode" 
              outlined 
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select 
              :items="['Android','iOS']" 
              label="Platform" 
              v-model="filters.platform" 
              outlined 
              dense
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field 
              label="AppId" 
              v-model="filters.appId" 
              outlined 
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" class="d-flex justify-end">
            <v-btn color="primary" @click="loadAssets" class="mt-2 mt-md-0">
              Refresh
            </v-btn>
          </v-col>
        </v-row>

        <!-- Таблица -->
        <v-row>
          <v-col cols="12">
            <asset-table :assets="assets" @open="openModal"></asset-table>
          </v-col>
        </v-row>

        <!-- Модальное окно -->
        <asset-modal v-model="modal" :item="selected"></asset-modal>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import AssetTable from './components/AssetTable.vue';
import AssetModal from './components/AssetModal.vue';

const assets = ref([]);
const filters = ref({ storeCode:'', platform:'', appId:'' });
const modal = ref(false);
const selected = ref(null);

async function loadAssets() {
  const params = {};
  if(filters.value.storeCode) params.storeCode = filters.value.storeCode;
  if(filters.value.platform) params.platform = filters.value.platform;
  if(filters.value.appId) params.appId = filters.value.appId;
  try {
    const res = await axios.get('http://localhost:3000/api/assets', { params });
    assets.value = res.data.data;

    // Динамически получаем FileSizeMB для каждого ассета
    for (const asset of assets.value) {
      if (!asset.FileSizeMB && asset.Url) {
        try {
          const r = await fetch(`http://localhost:3000/api/file-size?url=${encodeURIComponent(asset.Url)}`);
          const data = await r.json();
          if (data.ok && data.size) asset.FileSizeMB = +(data.size / (1024*1024)).toFixed(2);
          else asset.FileSizeMB = null;
        } catch {
          asset.FileSizeMB = null;
        }
      }
    }

  } catch (err) {
    console.error("Error loading assets:", err);
  }
}

function openModal(item) {
  selected.value = item;
  modal.value = true;
}

// Загрузка данных при старте
loadAssets();
</script>

<style scoped>
h2 {
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
