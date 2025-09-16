<template>
  <v-data-table :headers="headers" :items="assets" item-key="Url">
    <template #item.FileName="{ item }">
      <a href="#" @click.prevent="$emit('open', item)">{{ item.FileName }}</a>
    </template>
    <template #item.FileSizeMB="{ item }">
      {{ item.FileSizeMB }} MB
    </template>
  </v-data-table>
</template>

<script setup>
const props = defineProps({ assets: Array });
const headers = [
  { title:'Localization', key:'Localization' },
  { title:'Platform', key:'Platform' },
  { title:'AdType', key:'AdType' },
  { title:'FileName', key:'FileName' },
  { title:'Size', key:'FileSizeMB' },
];
</script>
