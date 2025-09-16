<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-title>{{ item?.Title || 'No title' }} - {{ item?.AdType || 'Unknown' }}</v-card-title>
      <v-card-text>
        <div v-if="item">
          <div><strong>File:</strong> {{ item.FileName }}</div>

          <!-- Размеры изображения -->
          <div v-if="imageDimensions">
            <strong>Dimensions:</strong> {{ imageDimensions.width }} x {{ imageDimensions.height }} px
          </div>

          <!-- Размер файла -->
          <div style="margin-top:5px">
            <strong>Size:</strong>
            <span v-if="fileSizeMB !== null">{{ fileSizeMB.toFixed(2) }} MB</span>
            <span v-else-if="item.FileSizeMB">{{ item.FileSizeMB.toFixed(2) }} MB</span>
            <span v-else>Unknown</span>
          </div>

          <div style="margin-top:10px">
            <!-- Индикатор загрузки -->
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
              class="my-4"
            ></v-progress-circular>

            <!-- Изображение -->
            <img
              v-if="isImage(item.FileName)"
              :src="item.Url"
              style="max-width:100%; display:block;"
              @load="onImageLoad"
            />

            <!-- Видео -->
            <video
              v-else-if="isVideo(item.FileName)"
              controls
              style="max-width:100%"
            >
              <source :src="item.Url" />
            </video>

            <!-- Прочие файлы -->
            <a v-else :href="item.Url" target="_blank">Open file</a>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('update:model-value', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  item: Object
});
defineEmits(['update:model-value']);

const imageDimensions = ref(null);
const fileSizeMB = ref(null);
const loading = ref(false);

// Проверка типа файла
function isImage(name){ return /\.(png|jpg|jpeg|gif)$/i.test(name); }
function isVideo(name){ return /\.(mp4|webm)$/i.test(name); }

// Получаем размеры картинки после загрузки
function onImageLoad(event){
  const img = event.target;
  imageDimensions.value = {
    width: img.naturalWidth,
    height: img.naturalHeight
  };
}

// Получаем размер файла через бэкенд-прокси
async function fetchFileSize(url){
  try {
    loading.value = true;
    // Полный URL к бэкенду
    const res = await fetch(`http://localhost:3000/api/file-size?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if(data.ok && data.size) fileSizeMB.value = data.size / (1024*1024);
    else fileSizeMB.value = null;
  } catch(err){
    console.warn('Cannot get file size:', err);
    fileSizeMB.value = null;
  } finally {
    loading.value = false;
  }
}

// Сбрасываем состояния при смене item
watch(() => props.item, (newItem) => {
  imageDimensions.value = null;
  fileSizeMB.value = null;
  loading.value = false;

  if(newItem && newItem.Url) fetchFileSize(newItem.Url);
});
</script>
