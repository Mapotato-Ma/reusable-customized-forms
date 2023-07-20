<template>
  <div class="views-entrance">
    <div class="ve-left">
      <!-- 表单控件仓库 -->
      <FormRepositoryComponent></FormRepositoryComponent>
    </div>
    <div class="ve-right">
      <!-- 示例1 -->
      <ReusableCustomForms :form-service="formServiceOne"></ReusableCustomForms>
      <CodeComponent :value="formServiceOne" v-show="formServiceOne.componentList.length > 0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormRepositoryComponent, ReusableCustomForms } from '@/common/components';
import { addComponent } from '@/common/components/form-repository';
import { FormService } from '@/common/components/reusable-custom-forms/reusable-custom-forms.service';
import { createVNode, reactive } from 'vue';

const formServiceOne = reactive<FormService>(new FormService());

addComponent(
  '原生输入框',
  'input',
  { modelValue: '我是Mapotato', placeholder: '请输入用户名' },
  { vModelProp: 'value', eventName: 'onInput' },
);

addComponent(
  '原生复选框',
  'input',
  { modelValue: true, type: 'checkbox' },
  { vModelProp: 'checked', eventName: 'onChange' },
);

addComponent(
  '原生颜色选择器',
  'input',
  { modelValue: '#2c2b9e', type: 'color' },
  { vModelProp: 'value', eventName: 'onInput' },
);

addComponent(
  '原生日期选择器',
  'input',
  { modelValue: '2023-07-12', type: 'date', min: '2018-01-01', max: '2025-12-31' },
  { vModelProp: 'value', eventName: 'onChange' },
);

/**
 * 数据结构显示组件
 * @param form 传参
 */
const CodeComponent = (form: { value: FormService }) =>
  createVNode('div', { class: 've-code-box' }, [
    ...form.value.componentList.map((form) =>
      createVNode('div', { class: 've-code-line', title: JSON.stringify(form) }, JSON.stringify(form)),
    ),
  ]);
</script>

<style lang="less" scoped>
.views-entrance {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px;
  gap: 10px;
  .ve-left {
    width: 430px;
  }
  .ve-right {
    flex-shrink: 0;
    width: calc(100% - 430px);
    height: 100%;
    overflow: auto;
  }
}
</style>

<style lang="less">
.ve-code-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  gap: 5px;
  background-color: #2c2b9e;
  color: #fff;
  font-size: 18px;
  font-weight: bolder;
  border-radius: 4px;
  overflow: hidden;
  .ve-code-line {
    cursor: pointer;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 3px;
    border: 2px solid #fff;
    border-radius: 4px;
  }
}
</style>
