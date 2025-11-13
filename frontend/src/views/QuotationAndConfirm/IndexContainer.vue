<template>
  <q-page padding>
    <SearchHeader v-model="url" @search-result="handleSearchResult" />
    <div class="row q-mb-xl">
      <div class="col-8 q-pr-sm">
        <component
          :is="contentComponents"
          v-model:htmlElement="htmlElement"
          @autoUpdate="(event) => autoUpdateMap[event]()"
        ></component>
      </div>
      <div class="col-4">
        <q-list bordered class="q-mt-md">
          <q-expansion-item v-model="sideBarExpanded" label="SideBar">
            <q-card>
              <q-card-section>
                <q-editor v-model="htmlElement.sideBar" :toolbar="[['viewsource']]" />
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
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import QuotationPage from './QuotationPage.vue'
import ConfirmPage from './ConfirmPage.vue'
import { parse } from 'node-html-parser'
import SearchHeader from '@/components/SearchHeader.vue'

const contentComponents = computed(() => {
  if (url.value.includes('confirm')) {
    return ConfirmPage
  }
  return QuotationPage
})
const htmlElement = reactive({
  h1: '',
  priceIncludes: '',
  priceExcludes: '',
  accordion: '',
  cancellationPolicy: '',
  detailUl: '',
  pricePayment: '',
  title: '',
  sideBar: '',
  accommodation: '',
  groupMember: '',
})
const sideBarExpanded = ref(true)
const $q = useQuasar()
const url = ref('')

const autoUpdateMap = {
  cancellationPolicy: () => {
    htmlElement.cancellationPolicy = `
  <div id="cancellationPolicy" class="p-2" style="margin-left:20px">
    <ol>
      <li>Cancellation notification received <strong>30 days</strong> prior to departure date: <strong>0%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>14 to 29 days</strong> prior to departure date: <strong>50%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>7 to 13 days</strong> prior to departure date: <strong>80%</strong> of total cost of holiday will be charged.</li>
      <li>Cancellation notification received <strong>6 to 0 days</strong> prior to: <strong>100%</strong> of total cost of holiday will be charged.</li>
    </ol>
  </div>`
  },
  priceIncludes: () => {
    const root = parse(htmlElement.priceIncludes)
    const list = root.querySelectorAll('li')
    //修改第五条
    list[4].set_content('<b>Simple English speaking driver.</b>')
    //删除最后一条
    if (list[6] && list[6].parentNode) {
      list[6].parentNode.removeChild(list[6])
    }
    htmlElement.priceIncludes = root.toString()
  },
  priceExcludes: () => {
    const root = parse(htmlElement.priceExcludes)
    const list = root.querySelector('ol')
    list.append('<li><strong>City tax&Onsen tax are excluded.</strong></li>')
    htmlElement.priceExcludes = root.toString()
  },
}
const handleSearchResult = (result) => {
  Object.assign(htmlElement, result)
}
const handleSave = () => {
  $q.loading.show()
  fetch('/minitoolapi/save-files/pdf', {
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
