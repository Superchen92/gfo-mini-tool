<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">登录</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="user.name" label="Username" type="text" />
      </q-card-section>
      <q-card-section>
        <q-input v-model="user.password" label="Password" type="password" />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" dense @click="handleOkClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, SessionStorage } from 'quasar'
import { reactive } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent()
const user = reactive({
  name: 'admin',
  password: '123456',
})

const handleOkClick = () => {
  fetch('/minitoolapi/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      SessionStorage.set('token', data.token)
      onDialogOK()
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('An error occurred during login.')
    })
}
</script>
