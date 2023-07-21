<template>
  <div class="views-entrance">
    <div class="ve-demo-one">
      <div class="ve-left">
        <!-- 仓库一 -->
        <FormRepositoryComponent :form-repository-service="formRepositoryOne"></FormRepositoryComponent>
      </div>
      <div class="ve-right">
        <!-- 表单一 -->
        <ReusableCustomForms
          :form-service="formServiceOne"
          :form-repository-service="formRepositoryOne"
        ></ReusableCustomForms>
        <CodeComponent :value="formServiceOne" v-show="formServiceOne.componentList.length > 0" />
      </div>
    </div>
    <div class="ve-demo-two">
      <div class="ve-left">
        <!-- 仓库二 -->
        <FormRepositoryComponent :form-repository-service="formRepositoryTwo"></FormRepositoryComponent>
      </div>
      <div class="ve-right">
        <!-- 表单二 -->
        <ReusableCustomForms
          :form-service="formServiceTwo"
          :form-repository-service="formRepositoryTwo"
        ></ReusableCustomForms>
        <CodeComponent :value="formServiceTwo" v-show="formServiceTwo.componentList.length > 0" />
      </div>
    </div>
    <div class="ve-demo-three">
      <div class="ve-left">
        <!-- 仓库三 -->
        <FormRepositoryComponent :form-repository-service="formRepositoryThree"></FormRepositoryComponent>
      </div>
      <div class="ve-right">
        <!-- 表单三 -->
        <ReusableCustomForms
          :form-service="formServiceThree"
          :form-repository-service="formRepositoryThree"
        ></ReusableCustomForms>
        <CodeComponent :value="formServiceThree" v-show="formServiceThree.componentList.length > 0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormRepositoryComponent, ReusableCustomForms } from '@/common/components';
import { FormRepository } from '@/common/components/form-repository';

import { FormService } from '@/common/components/reusable-custom-forms/reusable-custom-forms.service';
import { createVNode, reactive } from 'vue';

const formRepositoryOne = new FormRepository();
const formServiceOne = reactive<FormService>(new FormService());

const formRepositoryTwo = new FormRepository();
const formServiceTwo = reactive<FormService>(new FormService());

const formRepositoryThree = new FormRepository(true);
const formServiceThree = reactive<FormService>(new FormService());

(() => {
  formRepositoryOne.addComponent(
    '原生输入框',
    'input',
    { modelValue: '我是Mapotato', placeholder: '请输入用户名' },
    { vModelProp: 'value', eventName: 'onInput' },
  );

  formRepositoryOne.addComponent(
    '原生复选框',
    'input',
    { modelValue: true, type: 'checkbox' },
    { vModelProp: 'checked', eventName: 'onChange' },
  );

  formRepositoryOne.addComponent(
    '原生颜色选择器',
    'input',
    { modelValue: '#2c2b9e', type: 'color' },
    { vModelProp: 'value', eventName: 'onInput' },
  );

  formRepositoryOne.addComponent(
    '原生日期选择器',
    'input',
    { modelValue: '2023-07-12', type: 'date', min: '2018-01-01', max: '2025-12-31' },
    { vModelProp: 'value', eventName: 'onChange' },
  );

  formRepositoryOne.addComponent(
    '原生日期选择器',
    'input',
    { modelValue: '2023-07-18', type: 'date', min: '2018-01-01', max: '2025-12-31' },
    { vModelProp: 'value', eventName: 'onChange' },
  );

  formRepositoryTwo.addComponent(
    '原生日期选择器',
    'input',
    { modelValue: '2023-07-18', type: 'date', min: '2018-01-01', max: '2025-12-31' },
    { vModelProp: 'value', eventName: 'onChange' },
  );

  formRepositoryTwo.forceAddComponent(
    '原生日期选择器',
    'input',
    { modelValue: '2023-07-30', type: 'date', min: '2018-01-01', max: '2023-07-31' },
    { vModelProp: 'value', eventName: 'onChange' },
  );

  formRepositoryThree.addComponent(
    '原生输入框',
    'input',
    { modelValue: '我是Mapotato', placeholder: '请输入用户名' },
    { vModelProp: 'value', eventName: 'onInput' },
  );

  formRepositoryThree.addComponent(
    '原生复选框',
    'input',
    { modelValue: true, type: 'checkbox' },
    { vModelProp: 'checked', eventName: 'onChange' },
  );

  formRepositoryThree.addComponent(
    '原生颜色选择器',
    'input',
    { modelValue: '#2c2b9e', type: 'color' },
    { vModelProp: 'value', eventName: 'onInput' },
  );
})();

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
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  .ve-demo-one,
  .ve-demo-two,
  .ve-demo-three {
    display: flex;
    gap: 10px;
    .ve-left {
      width: 430px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .ve-right {
      flex-shrink: 0;
      width: calc(100% - 430px);
      height: 100%;
      overflow: auto;
    }
  }
}
</style>

<style lang="less">
.ve-code-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  margin-top: 5px;
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
