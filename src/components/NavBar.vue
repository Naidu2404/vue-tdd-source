<template>
  <nav class="navbar navbar-expand bg-body-tertiary shadow-sm">
    <div class="container">
      <router-link class="navbar-brand" data-testid="link-home-page" to="/">
        <img src="@/assets/hoaxify.png" alt="Hoaxify logo" width="60" />
        Hoaxify
      </router-link>
      <ul class="navbar-nav">
        <template v-if="!auth.id">
          <li class="nav-item">
            <router-link class="nav-link" data-testid="link-login-page" to="/login"
              >Login</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" data-testid="link-signup-page" to="/signup"
              >Sign Up</router-link
            >
          </li>
        </template>
        <template v-if="auth.id">
          <li class="nav-item">
            <router-link class="nav-link" data-testid="link-my-profile" :to="'/user/' + auth.id">
              <profile-image
                :alt="auth.username + ' profile'"
                width="30"
                height="30"
                class="rounded-circle shadow-sm"
                :image="auth.image"
              />
              {{ auth.username }}
            </router-link>
          </li>
          <li class="nav-item">
            <span class="nav-link" data-testid="link-logout" role="button" @click="logout"
              >Logout</span
            >
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import http from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import { ProfileImage } from './index'
const { auth, logout: logoutStore } = useAuthStore()

const logout = async () => {
  logoutStore()
  try {
    http.post('/api/v1/logout')
  } catch {}
}
</script>
