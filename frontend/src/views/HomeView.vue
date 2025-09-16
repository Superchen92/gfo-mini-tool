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
            <q-editor v-model="cancellationPolicy" :toolbar="toolBarConfigf" />
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
import { Loading } from 'quasar'
import { ref } from 'vue'

const url = ref('')
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
  Loading.show()
  fetch('/minitoolapi/file?url=' + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then((html) => {
      searchPage.value = html
      const root = parse(html)
      cancellationPolicy.value = root.querySelector('#cancellationPolicy')
        ? root.querySelector('#cancellationPolicy').toString()
        : ''
      priceIncludes.value = root.querySelector('#priceIncludes')
        ? root.querySelector('#priceIncludes').toString()
        : ''
      pricePayment.value = root.querySelector('#pricePayment')
        ? root.querySelector('#pricePayment').toString()
        : ''
      tourPrice.value = root.querySelector('#tourPrice')
        ? root.querySelector('#tourPrice').toString()
        : ''
      service.value = root.querySelector('.customer-service-card')
        ? root.querySelector('.customer-service-card').toString()
        : ''
    })
    .catch((error) => {
      console.error('Error fetching page:', error)
    })
    .finally(() => Loading.hide())
}
const handleCancellationPolicyTemp = () => {
  cancellationPolicy.value = `
  <div id="cancellationPolicy" class="p-2" style="margin-left:20px">
    <ol>
      <li>Cancellation notification received <strong>30 days</strong> prior to departure date: <strong>0%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>14 to 29 days</strong> prior to departure date: <strong>50%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>7 to 13 days</strong> prior to departure date: <strong>80%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>6 to 0 days</strong> prior to: <strong>100%</strong> of total cost of holiday will be charged.</li>
    </ol>
  </div>`
}
const handlePriceIncludesAutoUpdate = () => {
  const root = parse(priceIncludes.value)
  const list = root.querySelectorAll('li')
  //修改第五条
  list[4].set_content('<b>Simple English speaking driver.</b>')
  //删除最后一条
  if (list[6] && list[6].parentNode) {
    list[6].parentNode.removeChild(list[6])
  }
  priceIncludes.value = root.toString()
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
  root.querySelector('#cancellationPolicy')
    ? root.querySelector('#cancellationPolicy').replaceWith(cancellationPolicy.value)
    : ''
  root.querySelector('#priceIncludes')
    ? root.querySelector('#priceIncludes').replaceWith(priceIncludes.value)
    : ''
  root.querySelector('#pricePayment')
    ? root.querySelector('#pricePayment').replaceWith(pricePayment.value)
    : ''
  root.querySelector('#tourPrice')
    ? root.querySelector('#tourPrice').replaceWith(tourPrice.value)
    : ''
  root.querySelector('.customer-service-card')
    ? root.querySelector('.customer-service-card').replaceWith(service.value)
    : ''

  fetch('/minitoolapi/generate-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: url.value,
      content: root.toString(),
    }),
  }).then((response) => {
    if (response.ok) {
      alert('File saved successfully')
    } else {
      alert('Error saving file')
    }
  })
}
</script>
