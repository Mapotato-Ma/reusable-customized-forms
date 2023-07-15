import { Component } from 'vue';
import { Input, Checkbox, TimePicker } from 'tdesign-vue-next';
import diyComponentVue from './components/diy-component.vue';

/**
 * 组件类型库,可修改添加
 */
export enum E_FormType {
  输入框 = '输入框',
  复选框 = '复选框',
  自定义组件 = '自定义组件',
  时间选择器 = '时间选择器',
}

/**
 * 组件库,可修改添加
 */
export const formRepository: Record<E_FormType, Component> = {
  [E_FormType.输入框]: Input,
  [E_FormType.复选框]: Checkbox,
  [E_FormType.自定义组件]: diyComponentVue,
  [E_FormType.时间选择器]: TimePicker,
};

/**
 * 组件默认值库,可修改添加
 */
export const generateFormDefaultProps: () => Record<E_FormType, any> = () => ({
  [E_FormType.输入框]: {
    label: '标签:',
    placeholder: '请输入内容',
    name: '',
    readonly: false,
    modelValue: '',
  },
  [E_FormType.复选框]: {
    label: '复选框',
    name: '',
    modelValue: false,
  },
  [E_FormType.自定义组件]: {
    title: '嘿嘿，这是一个自定义组件，组件不允许编辑',
  },
  [E_FormType.时间选择器]: {
    size: 'medium',
    placeholder: '请选择时间',
    modelValue: '17:30:00',
    clearable: true,
  },
});
