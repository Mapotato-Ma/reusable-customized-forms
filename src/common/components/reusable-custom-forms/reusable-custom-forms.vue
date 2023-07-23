<template>
  <div
    :class="['reusable-custom-forms', dragClass]"
    v-easy-drop="{
      onEnterClass: 'reusable-custom-forms-dropped',
      dropCallback,
      sign: props.formRepositoryService.formSign,
    }"
  >
    <div class="rcf-item" v-for="(form, index) in props.formService.componentList" :key="index">
      <component
        :is="props.formRepositoryService.formRepository[form.type].component"
        v-bind="form.props"
        v-model="form.props.modelValue"
      ></component>
      <div class="rcf-item-operates">
        <t-button @click="drawVisibleMap[`${form.type}-${index}`] = true">
          <template #icon>
            <SettingIcon />
          </template>
        </t-button>
        <t-button @click="formService.moveForm(index, 'up')">
          <template #icon>
            <ArrowTriangleUpFilledIcon />
          </template>
        </t-button>
        <t-button @click="formService.moveForm(index, 'down')">
          <template #icon>
            <ArrowTriangleDownFilledIcon />
          </template>
        </t-button>
        <t-drawer
          v-model:visible="drawVisibleMap[`${form.type}-${index}`]"
          header="表单配置"
          :footer="false"
          :on-overlay-click="() => (drawVisibleMap[`${form.type}-${index}`] = false)"
        >
          <t-space direction="vertical" size="large" style="width: 100%">
            <t-space
              direction="vertical"
              :size="0"
              style="width: 100%"
              v-for="(prop, index) in Object.keys(form.props).filter((prop) => prop !== 'modelValue')"
              :key="index"
            >
              <span>{{ prop }}</span>
              <t-input v-model="form.props[prop]" v-if="typeof form.props[prop] === 'string'" />
              <t-checkbox v-model="form.props[prop]" v-else-if="typeof form.props[prop] === 'boolean'" />
            </t-space>
          </t-space>
          <template #footer></template>
        </t-drawer>
        <t-dropdown
          :options="[
            { content: '原位复制', value: index + 1, theme: 'default' },
            { content: '复制至结尾', value: Infinity, theme: 'default' },
            { content: '删除', value: index, theme: 'error' },
          ]"
          trigger="click"
          @click="operates($event, form)"
        >
          <t-button>
            <template #icon>
              <EllipsisIcon />
            </template>
          </t-button>
        </t-dropdown>
      </div>
    </div>
    <div class="rcf-empty" v-show="props.formService.componentList.length === 0">请从左侧拖入表单组件</div>
    <div class="rcf-placeholder"></div>
  </div>
</template>

<script lang="ts" setup>
import { vEasyDrop } from '@/common/directives/drag-drop.directive';
import { E_FormDragAndDrop, E_FormType, FormRepository } from '../form-repository';
import { FormService } from './reusable-custom-forms.service';
import {
  EllipsisIcon,
  SettingIcon,
  ArrowTriangleDownFilledIcon,
  ArrowTriangleUpFilledIcon,
} from 'tdesign-icons-vue-next';
import { DropdownOption } from 'tdesign-vue-next/es/dropdown/type';
import { I_FormListItem } from './reusable-custom-forms.service.api';
import { onUnmounted, ref } from 'vue';
const props = defineProps<{ formService: FormService; formRepositoryService: FormRepository }>();

const drawVisibleMap = ref<Record<string, boolean>>({});

// 拖拽类名（响应仓库）
const dragClass = ref<string>();
props.formRepositoryService.formDrag$.subscribe({
  next(value) {
    if (value === E_FormDragAndDrop.拖起) {
      dragClass.value = 'reusable-custom-forms-flashing';
    } else if (value === E_FormDragAndDrop.放下) {
      dragClass.value = '';
    }
  },
});
onUnmounted(() => props.formRepositoryService.formDrag$.unsubscribe());

function operates(e: DropdownOption, form: I_FormListItem) {
  const newForm: I_FormListItem = { type: form.type, props: { ...form.props } };
  switch (true) {
    case e.content === '原位复制' || e.content === '复制至结尾':
      props.formService.addForm(newForm, e.value as number);
      break;
    case e.content === '删除':
      props.formService.deleteForm(e.value as number);
      break;

    default:
      break;
  }
}

const dropCallback = (e: DragEvent) => {
  const formData = e.dataTransfer?.getData('formData') as E_FormType;
  if (formData) {
    const propData = props.formRepositoryService.formRepository[formData].props;
    props.formService.addForm({
      type: formData,
      props: { ...propData },
    });
  }
  props.formRepositoryService.formDrag$.next(E_FormDragAndDrop.放下);
};
</script>

<style lang="less" scoped>
@keyframes flashing {
  from {
    box-shadow: inset 0 0 10px 5px rgba(44, 43, 158, 0.3);
  }
  to {
    box-shadow: inset 0 0 10px 5px rgba(45, 43, 158, 0);
  }
}
.reusable-custom-forms {
  border: 3px solid rgba(45, 43, 158, 0.3);
  width: 100%;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 4px;
  overflow: hidden;
  transition: border 233ms;
  &.reusable-custom-forms-flashing {
    animation: flashing 233ms ease-in alternate infinite;
  }
  .rcf-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    overflow: hidden;
    border: 1px dotted rgba(45, 43, 158, 0.2);
    .rcf-item-operates {
      width: auto;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 10px;
    }
  }
  .rcf-empty {
    display: grid;
    place-content: center;
    height: 50px;
    color: rgba(45, 43, 158, 0.5);
  }
  .rcf-placeholder {
    margin-top: -5px;
    height: 0;
    width: 100%;
    transition: height 233ms;
  }
}
.reusable-custom-forms.reusable-custom-forms-dropped {
  border: 3px solid #2c2b9e;
  &.reusable-custom-forms-flashing {
    animation: unset;
  }
  .rcf-empty {
    display: none;
  }
  .rcf-placeholder {
    margin-top: 0;
    height: 50px;
    width: 100%;
    border: 2px dashed rgba(45, 43, 158, 0.5);
  }
}
</style>
