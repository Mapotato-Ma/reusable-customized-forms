<template>
  <div class="form-repository">
    <div
      class="fr-form-item"
      v-for="form in Object.keys(prop.formRepositoryService.formRepository)"
      :form="form"
      @dragend="() => prop.formRepositoryService.formDrag$.next(E_FormDragAndDrop.放下)"
      v-easy-drag="{ dragStartCallback, sign: prop.formRepositoryService.formSign }"
    >
      {{ form }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { vEasyDrag } from '@/common/directives/drag-drop.directive';
import { E_FormDragAndDrop, FormRepository } from '.';

const prop = defineProps<{ formRepositoryService: FormRepository }>();

const dragStartCallback = (e: DragEvent) => {
  const data = (e.target as HTMLElement).getAttribute('form');
  e.dataTransfer?.setData('formData', data!);
  prop.formRepositoryService.formDrag$.next(E_FormDragAndDrop.拖起);
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
  border-radius: 4px;
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
