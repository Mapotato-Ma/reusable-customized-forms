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
 * @description 组件仓库类
 * @author Mapotato
 * @date 21/07/2023
 * @class FormRepository
 */
export class FormRepository {
  /**
   * 组件库,可修改添加
   */
  formRepository: Record<E_FormType | string, { component: Component; props: any }> = {};

  // 仓库唯一标志，拖拽关联表单使用
  formSign: Symbol;

  /**
   * 创建一个组件仓库
   * @author Mapotato
   * @date 21/07/2023
   * @param {boolean} isClear 是否创建一个纯净仓库(无预制组件，所有组件均由自己添加)
   * @memberof FormRepository
   */
  constructor(isClear: boolean = false) {
    if (!isClear) {
      this.formRepository = {
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
    }
    this.formSign = Symbol();
  }

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
  addComponent(
    formType: E_FormType | string,
    component: Component | string,
    props: any,
    { vModelProp, eventName }: { vModelProp: string; eventName: string },
  ) {
    if (this.formRepository[formType]) {
      console.group('组件标识重复！');
      console.warn('%c因组件标识重复注册失败,请重新注册!', 'font-size: 18px');
      console.log(
        `%c已有组件标识: 
  %c${Object.keys(this.formRepository).join('|')}
%c重复标识: %c${formType}`,
        'font-size: 18px',
        'font-size: 14px;color:#5f44ff;font-weight:bolder',
        'font-size: 18px',
        'font-size: 14px;color:red;font-weight:bolder',
      );
      console.groupEnd();
      return false;
    }
    // 相同逻辑，只写一遍
    this.forceAddComponent(formType, component, props, { vModelProp, eventName });
    return true;
  }

  /**
   * @description 强制注册组件(会覆盖原有组件！)
   * @author Mapotato
   * @date 21/07/2023
   * @export
   * @param {(E_FormType | string)} formType 组件唯一标识
   * @param {(Component | string)} component 组件实例或标签名称
   * @param {*} props 此组件的默认props
   * @param {{ vModelProp: string; eventName: string }}:vModelProp为此组件需要双向绑定的prop字段名,eventName为自定义何时触发双向绑定的数据变更的事件名称
   */
  forceAddComponent(
    formType: E_FormType | string,
    component: Component | string,
    props: any,
    { vModelProp, eventName }: { vModelProp: string; eventName: string },
  ) {
    if (typeof component === 'string') {
      this.formRepository[formType] = {
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
      this.formRepository[formType] = { component, props };
    }
  }
}
