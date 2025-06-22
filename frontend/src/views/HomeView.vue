<template>
  <main class="q-pa-xl">
    <form @submit.prevent.stop="onSubmit">
      <div class="row q-gutter-md">
        <div class="col-8">
          <q-input v-model="url" dense rounded outlined label="URL" />
        </div>
        <div class="col-2">
          <q-btn label="Search" type="submit" color="primary" />
        </div>
      </div>
    </form>

    <q-list bordered class="q-mt-md">
      <q-expansion-item v-model="cancellationPolicyExpanded" label="Cancellation Policy">
        <q-card>
          <q-card-section>
            <q-editor v-model="cancellationPolicy" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="priceIncludesExpanded" label="Price Includes">
        <q-card>
          <q-card-section>
            <q-editor v-model="priceIncludes" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="pricePaymentExpanded" label="Price Payment">
        <q-card>
          <q-card-section>
            <q-editor v-model="pricePayment" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="tourPriceExpanded" label="Tour Price">
        <q-card>
          <q-card-section>
            <q-editor v-model="tourPrice" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="serviceExpanded" label="Sale Information">
        <q-card>
          <q-card-section>
            <q-editor v-model="service" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <q-page-sticky expand position="bottom">
      <div class="bg-white row justify-end q-pa-xs" style="width: 100%">
        <div class="col-1">
          <q-btn label="Save" type="submit" color="primary" @click="handleSave" />
        </div>
      </div>
    </q-page-sticky>
  </main>
</template>

<script setup>
import { parse } from 'node-html-parser'
import { ref } from 'vue'

const url = ref('/index.html')
const searchPage = ref()
const toolBarConfigf = ref([['viewsource']])
const cancellationPolicy = ref('')
const cancellationPolicyExpanded = ref(true)
const priceIncludes = ref('')
const priceIncludesExpanded = ref(false)
const pricePayment = ref('')
const pricePaymentExpanded = ref(false)
const tourPrice = ref('')
const tourPriceExpanded = ref(false)
const service = ref('')
const serviceExpanded = ref(false)

const getPageHtml = (url) => {
  fetch('/api/file?url=' + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then((html) => {
      searchPage.value = html
      const root = parse(html)
      cancellationPolicy.value = root.querySelector('#cancellationPolicy').toString()
      priceIncludes.value = root.querySelector('#priceIncludes').toString()
      pricePayment.value = root.querySelector('#pricePayment').toString()
      tourPrice.value = root.querySelector('#tourPrice').toString()
      service.value = root.querySelector('.customer-service-card').toString()
    })
    .catch((error) => {
      console.error('Error fetching page:', error)
    })
}
const onSubmit = () => {
  if (url.value) {
    getPageHtml(url.value)
  } else {
    alert('Please enter a URL')
  }
}
const handleSave = () => {
  const root = parse(searchPage.value)
  root.querySelector('#cancellationPolicy').replaceWith(cancellationPolicy.value)
  root.querySelector('#priceIncludes').replaceWith(priceIncludes.value)
  root.querySelector('#pricePayment').replaceWith(pricePayment.value)
  root.querySelector('#tourPrice').replaceWith(tourPrice.value)
  root.querySelector('.customer-service-card').replaceWith(service.value)

  fetch('/api/generate-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: 'test.html',
      content: root.toString(),
    }),
  })
}
</script>
