<template>
  <div
    class="reusable-custom-forms"
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
        <!-- TODO: 灵活配置props,用户可编辑 -->
        <t-button @click="drawVisible = true">
          <template #icon>
            <SettingIcon />
          </template>
        </t-button>
        <t-drawer v-model:visible="drawVisible" header="标题名称" :on-overlay-click="() => (drawVisible = false)">
          <t-space direction="vertical" size="large" style="width: 100%">
            <!-- <t-space direction="vertical" :size="0" style="width: 100%" v-for="formProp in Object.keys(form.props)">
              <span>{{ formProp }}</span>
              <t-input v-model="form.props[formProp]" />
            </t-space> -->
            <formPropControlsComponent v-bind="form"></formPropControlsComponent>
          </t-space>
        </t-drawer>
        <t-dropdown
          :options="[
            { content: '原位复制', value: index + 1 },
            { content: '复制至结尾', value: Infinity },
            { content: '删除', value: index },
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
import { E_FormType, FormRepository } from '../form-repository';
import { FormService } from './reusable-custom-forms.service';
import { EllipsisIcon, SettingIcon } from 'tdesign-icons-vue-next';
import { DropdownOption } from 'tdesign-vue-next/es/dropdown/type';
import { I_FormListItem } from './reusable-custom-forms.service.api';
import { createVNode, ref } from 'vue';
import { Input } from 'tdesign-vue-next';
const props = defineProps<{ formService: FormService; formRepositoryService: FormRepository }>();

const drawVisible = ref<boolean>(false);

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
};

const formPropControlsComponent = (form: { type: string; props: any }) =>
  Object.keys(form.props)
    .filter((prop) => prop !== 'modelValue')
    .map((prop) => {
      console.log(prop);
      return createVNode('div', { style: 'width: 100%' }, [
        createVNode('span', {}, prop),
        createVNode(
          Input,
          {
            modelValue: form.props[prop],
            'onUpdate:modelValue': (value: any) => {
              form.props[prop] = value;
            },
          },
          prop,
        ),
      ]);
    });
</script>

<style lang="less" scoped>
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
  .rcf-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    overflow: hidden;
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
