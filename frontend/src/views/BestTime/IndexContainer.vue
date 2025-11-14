<template>
  <q-page padding>
    <SearchHeader v-model="url" type="best-time" @search-result="handleSearchResult" />
    <q-editor class="q-mt-md" v-model="html" :toolbar="[['viewsource']]" />
    <q-page-sticky expand position="bottom">
      <div class="bg-white row justify-end q-pa-xs" style="width: 100%">
        <div class="col-1">
          <q-btn label="Save" type="submit" color="primary" @click="handleSave" />
        </div>
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import SearchHeader from '@/components/SearchHeader.vue'

const html = ref('')
const url = ref('/thailand-guide/best-time.html')
const $q = useQuasar()

const handleSearchResult = (data) => {
  console.log(data)
  html.value = data.body
}
const handleSave = () => {
  $q.loading.show()
  fetch('/minitoolapi/save-files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename: url.value, body: html.value }),
  })
    .then(() => {
      $q.notify({
        message: 'HTML file saved successfully',
        color: 'positive',
      })
    })
    .finally(() => $q.loading.hide())
}
</script>
