<template>
  <q-list bordered class="q-mt-md">
    <q-expansion-item v-model="cancellationPolicyExpanded" label="Group Member Information">
      <q-card>
        <q-card-section>
          <q-editor v-model="htmlElement.groupMember" :toolbar="[['viewsource']]" />
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
            @click="emits('autoUpdate', 'cancellationPolicy')"
          />
          <q-editor v-model="htmlElement.cancellationPolicy" :toolbar="[['viewsource']]" />
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
            @click="emits('autoUpdate', 'priceIncludes')"
          />
          <q-editor v-model="htmlElement.priceIncludes" :toolbar="[['viewsource']]" />
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
            @click="emits('autoUpdate', 'priceExcludes')"
          />
          <q-editor v-model="htmlElement.priceExcludes" :toolbar="[['viewsource']]" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-separator />
    <q-expansion-item v-model="accommodationExpanded" label="Accommodation">
      <q-card>
        <q-card-section>
          <q-editor v-model="htmlElement.accommodation" :toolbar="[['viewsource']]" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-separator />
    <q-expansion-item v-model="accordionExpanded" label="ITINERARY">
      <q-card>
        <q-card-section>
          <q-editor v-model="htmlElement.accordion" :toolbar="[['viewsource']]" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
import { ref } from 'vue'

const htmlElement = defineModel('htmlElement', { type: Object, default: () => ({}) })
const emits = defineEmits(['autoUpdate'])
const accordionExpanded = ref(false)
const cancellationPolicyExpanded = ref(true)
const priceIncludesExpanded = ref(true)
const priceExcludesExpanded = ref(true)
const accommodationExpanded = ref(true)
</script>
