<template>
    <div>
        <canvas ref="canvas" style="width: 100vw; height: 100vh;"></canvas>
    </div>
</template>

<script setup lang="ts">
import { isPrime } from "@/utils/math";
import { onMounted, onUnmounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

// 当前线条的起点和终点
let currentX = 0;
let currentY = 0;
let nextX = 0;
let nextY = 0;
let startNum = 1;

// 缩放相关变量
let scale = 1; // 当前缩放比例
const minScale = 0.5; // 最小缩放比例
const maxScale = 5; // 最大缩放比例

// 平移相关变量
let isDragging = false; // 是否正在拖动
let lastMouseX = 0; // 上一次鼠标的 X 坐标
let lastMouseY = 0; // 上一次鼠标的 Y 坐标
let offsetX = 0; // 当前画布的 X 偏移量
let offsetY = 0; // 当前画布的 Y 偏移量

// 绘制一条线
const drawLine = (x: number, y: number, x1: number, y1: number) => {
    if (!ctx) return;
    ctx.strokeStyle = "black"; // 线条颜色
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y); // 起点
    ctx.lineTo(x1, y1); // 终点
    ctx.stroke();
};

let direction: [number, number] = [1, 0];
const rotate90 = (vector: [number, number]): [number, number] => {
    const [x, y] = vector;
    return [-y, x];
};

// 动态绘制线条（带过渡效果）
const animateLine = () => {
    startNum++;
    if (!ctx || !canvas.value) return;
    if (isPrime(startNum)) {
        direction = rotate90(direction);
    }

    nextX = currentX + direction[0] * 5;
    nextY = currentY + direction[1] * 5;

    // 绘制当前线条
    drawLine(currentX, currentY, nextX, nextY);

    currentX = nextX;
    currentY = nextY;

    // 请求下一帧
    requestAnimationFrame(animateLine);
};

// 调整 canvas 尺寸
const resizeCanvas = () => {
    if (canvas.value) {
        const dpr = window.devicePixelRatio || 1;
        canvas.value.width = window.innerWidth * dpr;
        canvas.value.height = window.innerHeight * dpr;

        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        // 设置屏幕中心为 (0, 0)
        currentX = canvas.value.width / 2;
        currentY = canvas.value.height / 2;
        nextX = currentX + 5;
        nextY = currentY;
    }
};

// 处理鼠标滚轮缩放
const handleWheel = (event: WheelEvent) => {
    if (!ctx || !canvas.value) return;

    // 获取滚轮方向
    const delta = event.deltaY > 0 ? -0.1 : 0.1;

    // 更新缩放比例，限制在 minScale 和 maxScale 之间
    const newScale = Math.min(maxScale, Math.max(minScale, scale + delta));

    // 计算缩放中心点
    const centerX = canvas.value.width / 2;
    const centerY = canvas.value.height / 2;

    // 调整画布缩放
    ctx.translate(centerX, centerY); // 将画布平移到中心
    ctx.scale(newScale / scale, newScale / scale); // 按比例缩放
    ctx.translate(-centerX, -centerY); // 将画布平移回原位置

    // 更新当前缩放比例
    scale = newScale;

    // 重新绘制内容
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    drawLine(currentX, currentY, nextX, nextY);
};

// 处理鼠标拖动开始
const handleMouseDown = (event: MouseEvent) => {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
};

// 处理鼠标拖动
const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !ctx) return;

    // 计算鼠标移动的距离
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;

    // 更新偏移量
    offsetX += dx;
    offsetY += dy;

    // 平移画布
    ctx.translate(dx, dy);

    // 更新鼠标位置
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // 重新绘制内容
    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
    drawLine(currentX, currentY, nextX, nextY);
};

// 处理鼠标拖动结束
const handleMouseUp = () => {
    isDragging = false;
};

onMounted(() => {
    ctx = canvas.value?.getContext("2d")!;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.value?.addEventListener("wheel", handleWheel); // 监听鼠标滚轮事件
    canvas.value?.addEventListener("mousedown", handleMouseDown); // 监听鼠标按下事件
    canvas.value?.addEventListener("mousemove", handleMouseMove); // 监听鼠标移动事件
    canvas.value?.addEventListener("mouseup", handleMouseUp); // 监听鼠标抬起事件
    canvas.value?.addEventListener("mouseleave", handleMouseUp); // 防止鼠标移出画布时仍然拖动

    // 绘制初始线条
    drawLine(currentX, currentY, nextX, nextY);

    // 开始动画
    animateLine();
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.value?.removeEventListener("wheel", handleWheel);
    canvas.value?.removeEventListener("mousedown", handleMouseDown);
    canvas.value?.removeEventListener("mousemove", handleMouseMove);
    canvas.value?.removeEventListener("mouseup", handleMouseUp);
    canvas.value?.removeEventListener("mouseleave", handleMouseUp);
});
</script>

<style>
canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
</style>