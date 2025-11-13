<template>
  <q-page padding>
    <div class="row q-px-xl q-gutter-xl">
      <div class="text-center cursor-pointer" @click="router.push('/quotationandconfirm')">
        <q-icon name="article" color="primary" size="100px" />
        <div class="text-h5 text-bold">报价信</div>
      </div>
      <div class="text-center cursor-pointer" @click="router.push('/besttime')">
        <q-icon name="calendar_month" color="secondary" size="100px" />
        <div class="text-h5 text-bold">Best Time</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
