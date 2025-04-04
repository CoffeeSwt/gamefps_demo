<template>
  <div flex-center size-screen flex-col>
    <h1 text-3xl font-600 text-coolGray-600 font-mono cursor-pointer duration-300 hover:text-dark
      @click="routeTo('/game')">Game
    </h1>
    <h1 text-3xl font-600 text-coolGray-600 font-mono cursor-pointer duration-300 hover:text-dark
      @click="routeTo('/prime')">Prime
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const routeTo = (path: string) => {
  router.push(path)
}
</script>
