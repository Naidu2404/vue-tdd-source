<template>
  <Card>
    <template v-slot:header>
      <ProfileImage
        class="rounded-circle shadow"
        width="200"
        height="200"
        :alt="user.username + ' profile'"
        :tempImage="tempImage"
        :image="image"
      />
    </template>
    <template v-slot:body>
      <div class="text-center">
        <template v-if="!editMode">
          <h3>{{ username }}</h3>
          <AppButton v-if="auth.id === user.id" @click="editMode = !editMode">{{
            $t('edit')
          }}</AppButton>
          <div class="mt-3"></div>
          <UserDeleteButton :id="user.id" />
        </template>
        <EditForm
          v-if="editMode"
          @cancel="onEditFinish"
          @save="onEditFinish"
          @newImage="onNewImage"
        />
      </div>
    </template>
  </Card>
</template>
<script setup>
import { AppButton, Card, ProfileImage } from '@/components'
import UserDeleteButton from './UserDeleteButton.vue'

import { useAuthStore } from '@/stores/auth'
import EditForm from './EditForm.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  user: Object
})

const editMode = ref(false)
const tempImage = ref()
const { auth } = useAuthStore()
const username = computed(() => (auth.id === props.user.id ? auth.username : props.user.username))
const image = computed(() => (auth.id === props.user.id ? auth.image : props.user.image))

const onNewImage = (data) => {
  tempImage.value = data
}

const onEditFinish = () => {
  editMode.value = false
  tempImage.value = undefined
}
</script>
