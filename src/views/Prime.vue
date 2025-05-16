<template>
    <div cursor-crosshair absolute top-0 left-0 w-screen h-screen overflow-hidden ref="canvasTarget">
        <div hover:bg-coolgray-4 duration-300 font-mono lg:text-2xl fixed top-0 left-0 w-screen py4>
            <div cursor-pointer flex items-center flex-col line-height-tight>
                <div>Hold the right mouse button to drag.</div>
                <div>Scroll the wheel to zoom.</div>
                <div lg:text-3xl>Current Number is : {{ currentNum }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BasicObject, MainEngine } from '@/assets/ts';
import { isPrime } from '@/utils/math';
import { Vector3 } from 'three';
import { onMounted, onUnmounted, ref } from 'vue';
const engine: MainEngine = new MainEngine();
const canvasTarget = ref<HTMLDivElement | null>(null);
const initEngine = () => {
    engine.init(canvasTarget.value!).start();
    engine.changeCamera('orthographic');
    engine.setCameraPosition(0, 10, 0);
    engine.lookAt(0, 0, 0);
    engine.disableRotation();
    startDraw()
}
const currentNum = ref(1);
const startDraw = () => {
    const drawLine = (from: [number, number], to: [number, number]) => {
        engine.addObject(BasicObject.createLine([
            new Vector3(from[0], 0, from[1]),
            new Vector3(to[0], 0, to[1]),
        ], 0x000000));
    }
    const rotate90 = (vector: [number, number], clockwise: boolean = true): [number, number] => {
        const [x, y] = vector;
        return clockwise ? [y, -x] : [-y, x];
    };

    const max = 10000;
    let direction: [number, number] = [1, 0];
    const from: [number, number] = [0, 0];
    const to: [number, number] = [1, 0];
    drawLine(from, to)
    const draw = () => {
        from[0] = to[0];
        from[1] = to[1];
        currentNum.value++
        if (currentNum.value > max) {
            return;
        }
        if (isPrime(currentNum.value)) {
            direction = rotate90(direction)
        }
        to[0] += direction[0];
        to[1] += direction[1];
        drawLine(from, to)
        requestAnimationFrame(draw);
    }
    draw()
}

onMounted(() => {
    initEngine()
});
onUnmounted(() => {
    engine.stop();
});
</script>