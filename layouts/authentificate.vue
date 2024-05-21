<template>
  <NuxtImg src="/images/layouts/Mountains.jpg" alt="" class="absolute z-0 w-full h-full object-cover"/>
  <div class="lg:grid grid-cols-2">
    <div class="col-span-1"></div>
    <div class="col-span-1">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>