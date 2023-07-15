<template>
  <div class="diy-component">{{ props.title }}</div>
</template>

<script lang="ts" setup>
const props = defineProps<{ title: string }>();
</script>

<style lang="less" scoped>
.diy-component {
  width: 100%;
  color: #fff;
  padding: 10px;
  background-color: rgb(66, 49, 224);
}
</style>
