<template>
    <div absolute top-0 left-0 w-screen h-screen overflow-hidden z-1 ref="canvasTarget">

    </div>
    <!-- <div fixed top-20 left-20 w-50 h-30 shadow-2xl border-black border-solid z-10> -->
        <!-- <div relative top-0 left-0 w-full v-show="isDebugMode">debugMode on</div> -->
        <!-- <div relative top-0 left-0 w-full v-show="!isDebugMode">debugMode off</div> -->
        <!-- <button relative @click.stop="toggleDebugMode">toggleDebugMode</button> -->
    <!-- </div> -->

</template>

<script setup lang="ts">
import { BasicLight, BasicObject, MainEngine } from '@/assets/ts';
import { EquirectangularReflectionMapping, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
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
    const loader = new TextureLoader();
    const texture = loader.load(
        '/tears_of_steel_bridge_4k.jpg',
        (data) => {
            texture.mapping = EquirectangularReflectionMapping;
            texture.colorSpace = SRGBColorSpace;
            engine.scene.background = texture;
            // console.log('texture loaded', data);
        },
        (e) => {
            console.log(e)
        });
    engine.setCameraPosition(10, 10, 10);
    engine.addObject(BasicObject.createBox(1, 1, 1, 0x11ffff));
    engine.addObject(BasicLight.createDirectionalLight(0xffffff, 20, new Vector3(100, 100, 100)));
    engine.addObject(BasicLight.createHemisphereLight(0xffffff, 0x000000, 100));
}

onMounted(() => {
    initEngine()
});
onUnmounted(() => {
    engine.stop();
});
</script>