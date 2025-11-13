<template>
  <form @submit.prevent.stop="getPageHtml">
    <div class="row q-gutter-md">
      <div class="col-8">
        <q-input v-model="url" dense rounded outlined label="URL" />
      </div>
      <div class="col-2">
        <q-btn label="Search" type="submit" color="primary" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { defineModel } from 'vue'
import { useQuasar } from 'quasar'

const url = defineModel({
  type: String,
  default: '',
})
const props = defineProps({
  type: {
    type: String,
    default: 'pdf',
  },
})
const $q = useQuasar()
const emits = defineEmits(['search-result'])

const getPageHtml = () => {
  if (!url.value) {
    alert('Please enter a URL')
    return
  }
  $q.loading.show()
  fetch('/minitoolapi/get-files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url.value,
      type: props.type,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      emits('search-result', data)
    })
    .catch((error) => {
      $q.notify({
        message: 'Error fetching page: ' + error.message,
        color: 'negative',
      })
    })
    .finally(() => $q.loading.hide())
}
</script>
