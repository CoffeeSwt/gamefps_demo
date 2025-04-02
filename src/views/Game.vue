<template>
    <div size-screen ref="canvasTarget"></div>
</template>

<script setup lang="ts">
import { BasicLight, BasicObject, MainEngine } from '@/assets/ts';
import { onMounted, ref } from 'vue';
const canvasTarget = ref<HTMLDivElement | null>(null);
onMounted(() => {
    const engine = new MainEngine(canvasTarget.value!);
    engine.start();
    engine.addObject(BasicObject.createBox(10, 10, 10, 0xfff));
    // engine.addObject(BasicLight.createDirectionalLight(0xfff, 10, new Vector3(30, 30, 30)))
    engine.addObject(BasicLight.createAmbientLight(0x404040, 10));
});
</script>