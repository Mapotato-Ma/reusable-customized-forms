<template>
  <div class="form-repository">
    <div
      class="fr-form-item"
      v-for="form in Object.keys(prop.formRepositoryService.formRepository)"
      :form="form"
      v-easy-drag="{ dragStartCallback, sign: prop.formRepositoryService.formSign }"
    >
      {{ form }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { vEasyDrag } from '@/common/directives/drag-drop.directive';
import { FormRepository } from '.';

const prop = defineProps<{ formRepositoryService: FormRepository }>();

const dragStartCallback = (e: DragEvent) => {
  const data = (e.target as HTMLElement).getAttribute('form');
  e.dataTransfer?.setData('formData', data!);
};
</script>

<style lang="less" scoped>
.form-repository {
  display: grid;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(2, minmax(100px, 200px));
  grid-auto-rows: 50px;
  background-color: #2c2b9e;
  color: #fff;
  overflow: auto;
  border-radius: 5%;
  .fr-form-item {
    cursor: move;
    user-select: none;
    display: grid;
    place-content: center;
    background-color: #1e80ff;
    border-radius: 999999999em;
    contain: paint;
  }
}
</style>
