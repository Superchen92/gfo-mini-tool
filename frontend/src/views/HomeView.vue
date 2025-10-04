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
            <q-btn
              class="q-mb-sm"
              label="use template"
              color="primary"
              dense
              outline
              @click="handleCancellationPolicyTemp"
            />
            <q-editor v-model="htmlElement.cancellationPolicy" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="priceIncludesExpanded" label="Price Includes">
        <q-card>
          <q-card-section>
            <q-btn
              class="q-mb-sm"
              label="AUTO UPDATE"
              color="primary"
              dense
              outline
              @click="handlePriceIncludesAutoUpdate"
            />
            <q-editor v-model="htmlElement.priceIncludes" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="pricePaymentExpanded" label="Price Payment">
        <q-card>
          <q-card-section>
            <q-editor v-model="htmlElement.pricePayment" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="tourPriceExpanded" label="Tour Price">
        <q-card>
          <q-card-section>
            <q-editor v-model="htmlElement.tourPrice" :toolbar="toolBarConfigf" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item v-model="serviceExpanded" label="Sale Information">
        <q-card>
          <q-card-section>
            <q-editor v-model="htmlElement.service" :toolbar="toolBarConfigf" />
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
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'

const $q = useQuasar()
const url = ref('/Itinerary/GF20250925Laura-CB/quotation202510026006.html')
const toolBarConfigf = ref([['viewsource']])
const cancellationPolicyExpanded = ref(true)
const priceIncludesExpanded = ref(false)
const pricePaymentExpanded = ref(false)
const tourPriceExpanded = ref(false)
const serviceExpanded = ref(false)
const htmlElement = reactive({
  h1: '',
  priceIncludes: '',
  accordion: '',
  cancellationPolicy: '',
  detailUl: '',
  pricePayment: '',
  service: '',
  title: '',
  tourPrice: '',
})

const getPageHtml = (url) => {
  fetch('/api/get-files?url=' + url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      Object.assign(htmlElement, data)
    })
    .catch((error) => {
      console.error('Error fetching page:', error)
    })
}
const handleCancellationPolicyTemp = () => {
  htmlElement.cancellationPolicy = `
  <div id="cancellationPolicy" class="p-2" style="margin-left:20px">
    <ol>
      <li>Cancellation notification received 30 days prior to departure date: 0% of total cost of holiday will be charged.</li>
      <li>Cancellation notification received 14 to 29 days prior to departure date: 50% of total cost of holiday will be charged.</li>
      <li>Cancellation notification received 7 to 13 days prior to departure date: 80% of total cost of holiday will be charged.</li>
      <li>Cancellation notification received 6 to 0 days prior to: 100% of total cost of holiday will be charged.</li>
    </ol>
  </div>`
}
const handlePriceIncludesAutoUpdate = () => {
  const root = parse(htmlElement.priceIncludes)
  const list = root.querySelectorAll('li')
  //修改第五条
  list[4].set_content('Simple English speaking driver.')
  //删除最后一条
  if (list[6] && list[6].parentNode) {
    list[6].parentNode.removeChild(list[6])
  }
  htmlElement.priceIncludes = root.toString()
}
const onSubmit = () => {
  if (url.value) {
    getPageHtml(url.value)
  } else {
    alert('Please enter a URL')
  }
}
const handleSave = () => {
  $q.loading.show()
  fetch('/api/save-files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename: url.value, ...htmlElement }),
  })
    .then((response) => {
      if (response.ok) {
        alert('File saved successfully')
      } else {
        alert('Error saving file')
      }
    })
    .finally(() => {
      $q.loading.hide()
    })
}
</script>
