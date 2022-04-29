<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :key="key">
        <router-view/>
      </keep-alive>
    </transition>
  </section>
</template>
<script lang="ts" setup>
import { ref, defineComponent } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const key = computed(() => router.currentRoute.value.path)
</script>
<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>
