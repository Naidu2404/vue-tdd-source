<template>
  <div data-testid="user-page">
    <Alert v-if="status === 'fail'" varient="danger">
      {{ error }}
    </Alert>
    <Alert varient="secondary" center v-if="status === 'loading'">
      <Spinner size="normal" />
    </Alert>
    <ProfileCard v-if="status === 'success'" :user="data" />
  </div>
</template>

<script setup>
import ProfileCard from './components/ProfileCard.vue'
import { Spinner, Alert } from '@/components'
import { getUserById } from './api'

import useRouteParamApiRequest from '@/shared/useRouteParamApiRequest'

const { status, data, error } = useRouteParamApiRequest(getUserById, 'id')
</script>
