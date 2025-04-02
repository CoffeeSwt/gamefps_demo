<template>
  <div flex-center size-screen flex-col>
    <h1 font-600 text-coolGray-600 font-mono cursor-pointer duration-300 hover:text-dark @click="routeTo('/game')">Go
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
