<template>
  <q-page padding>
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
    <div class="row">
      <div class="col-8 q-pr-sm">
        <q-list bordered class="q-mt-md">
          <q-expansion-item v-model="accordionExpanded" label="ITINERARY">
            <q-card>
              <q-card-section>
                <q-editor v-model="htmlElement.accordion" :toolbar="toolBarConfigf" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
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
          <q-expansion-item v-model="priceExcludesExpanded" label="Price Excludes">
            <q-card>
              <q-card-section>
                <q-btn
                  class="q-mb-sm"
                  label="AUTO UPDATE"
                  color="primary"
                  dense
                  outline
                  @click="handlePriceExcludesAutoUpdate"
                />
                <q-editor v-model="htmlElement.priceExcludes" :toolbar="toolBarConfigf" />
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
        </q-list>
      </div>
      <div class="col-4">
        <q-list bordered class="q-mt-md">
          <q-expansion-item v-model="sideBarExpanded" label="SideBar">
            <q-card>
              <q-card-section>
                <q-editor v-model="htmlElement.quotationSideBar" :toolbar="toolBarConfigf" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

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
import { parse } from 'node-html-parser'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'

const $q = useQuasar()
const url = ref('')
const toolBarConfigf = ref([['viewsource']])
const accordionExpanded = ref(false)
const cancellationPolicyExpanded = ref(true)
const priceIncludesExpanded = ref(true)
const priceExcludesExpanded = ref(true)
const pricePaymentExpanded = ref(true)
const sideBarExpanded = ref(true)
const htmlElement = reactive({
  h1: '',
  priceIncludes: '',
  priceExcludes: '',
  accordion: '',
  cancellationPolicy: '',
  detailUl: '',
  pricePayment: '',
  title: '',
  quotationSideBar: '',
})

const getPageHtml = (url) => {
  $q.loading.show()
  fetch('/minitoolapi/get-files?url=' + url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      Object.assign(htmlElement, data)
    })
    .catch((error) => {
      console.error('Error fetching page:', error)
    })
    .finally(() => $q.loading.hide())
}
const handleCancellationPolicyTemp = () => {
  htmlElement.cancellationPolicy = `
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
  const root = parse(htmlElement.priceIncludes)
  const list = root.querySelectorAll('li')
  //修改第五条
  list[4].set_content('<b>Simple English speaking driver.</b>')
  //删除最后一条
  if (list[6] && list[6].parentNode) {
    list[6].parentNode.removeChild(list[6])
  }
  htmlElement.priceIncludes = root.toString()
}
const handlePriceExcludesAutoUpdate = () => {
  const root = parse(htmlElement.priceExcludes)
  const list = root.querySelector('ol')
  list.append('<li><strong>City tax&lOnsen tax are excluded.</strong></li>')
  htmlElement.priceExcludes = root.toString()
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
  fetch('/minitoolapi/save-files', {
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
