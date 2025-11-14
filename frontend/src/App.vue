<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense>
          <q-icon name="home" @click="router.push('/')" />
        </q-btn>
        <q-toolbar-title> Mini Tool </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <q-footer reveal class="bg-grey-8 text-white"> </q-footer>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
