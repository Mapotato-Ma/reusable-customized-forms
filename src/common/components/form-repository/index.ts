import { Component, createVNode, ref } from 'vue';
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
export const formRepository: Record<E_FormType | string, { component: Component; props: any }> = {
  [E_FormType.输入框]: {
    component: Input,
    props: {
      label: '标签:',
      placeholder: '请输入内容',
      name: '',
      readonly: false,
      modelValue: '',
    },
  },
  [E_FormType.复选框]: {
    component: Checkbox,
    props: {
      label: '复选框',
      name: '',
      modelValue: false,
    },
  },
  [E_FormType.自定义组件]: {
    component: diyComponentVue,
    props: {
      title: '嘿嘿，这是一个自定义组件，组件不允许编辑',
    },
  },
  [E_FormType.时间选择器]: {
    component: TimePicker,
    props: {
      size: 'medium',
      placeholder: '请选择时间',
      modelValue: '17:30:00',
      clearable: true,
    },
  },
};

/**
 * @description 注册组件
 * @author Mapotato
 * @date 21/07/2023
 * @export
 * @param {(E_FormType | string)} formType 组件唯一标识
 * @param {(Component | string)} component 组件实例或标签名称
 * @param {*} props 此组件的默认props
 * @param {{ vModelProp: string; eventName: string }}:vModelProp为此组件需要双向绑定的prop字段名,eventName为自定义何时触发双向绑定的数据变更的事件名称
 */
export const addComponent = (
  formType: E_FormType | string,
  component: Component | string,
  props: any,
  { vModelProp, eventName }: { vModelProp: string; eventName: string },
) => {
  if (formRepository[formType]) {
    throw new Error('因组件标识重复注册失败,请重新注册!');
  } else {
    if (typeof component === 'string') {
      formRepository[formType] = {
        component: {
          props: [...Object.keys(props)],
          emits: ['update:modelValue'],
          setup(props, { emit }) {
            const rootElement = ref();
            return () =>
              createVNode(component, {
                ...props,
                ref: rootElement,
                [eventName]: (event: Event) => emit('update:modelValue', (event.target as any)[vModelProp]),
              });
          },
          mounted() {
            this.$el[vModelProp] = this.modelValue;
          },
        },
        props,
      };
    } else {
      formRepository[formType] = { component, props };
    }
  }
};
