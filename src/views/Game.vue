<template>
    <div absolute top-0 left-0 w-screen h-screen overflow-hidden ref="canvasTarget">
        <div absolute top-20 left-20 w-50 h-30 shadow-2xl border-black border-solid @click="toggleDebugMode">
            <div relative top-0 left-0 w-full h-full v-show="isDebugMode">debugMode on</div>
            <div relative top-0 left-0 w-full h-full v-show="!isDebugMode">debugMode off</div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { BasicLight, BasicObject, MainEngine } from '@/assets/ts';
import { onMounted, onUnmounted, ref } from 'vue';
const engine: MainEngine = new MainEngine();
const isDebugMode = ref(false); // 创建响应式变量

const toggleDebugMode = () => {
    engine.changeDebugMode();
    isDebugMode.value = engine.debugMode; // 手动同步 debugMode 的值
};

const canvasTarget = ref<HTMLDivElement | null>(null);
const initEngine = () => {
    engine.init(canvasTarget.value!).start();
    engine.addObject(BasicObject.createBox(3, 3, 3, 0xfff));
    engine.addObject(BasicLight.createAmbientLight(0x404040, 10));
    engine.changeCamera('orthographic');
    engine.setCameraPosition(0, 10, 0);
    engine.lookAt(0, 0, 0);
    engine.disableRotation();
}
onMounted(() => {
    initEngine()
});
onUnmounted(() => {
    engine.stop();
});
</script>