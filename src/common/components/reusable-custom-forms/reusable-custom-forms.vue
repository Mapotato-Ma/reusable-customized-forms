<template>
  <div
    class="reusable-custom-forms"
    v-easy-drop="{ onEnterClass: 'reusable-custom-forms-dropped', dropCallback, sign: 'form' }"
  >
    <div class="rcf-item" v-for="(form, index) in props.formService.componentList" :key="index">
      <component
        :is="formRepository[form.type].component"
        v-bind="formRepository[form.type].props"
        v-model="form.props.modelValue"
      ></component>
      <div class="rcf-item-operates">
        <!-- TODO: 灵活配置props,用户可编辑 -->
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
import { formRepository, E_FormType } from '../form-repository';
import { FormService } from './reusable-custom-forms.service';
import { EllipsisIcon } from 'tdesign-icons-vue-next';
import { DropdownOption } from 'tdesign-vue-next/es/dropdown/type';
import { I_FormListItem } from './reusable-custom-forms.service.api';
const props = defineProps<{ formService: FormService }>();

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
    const propData = formRepository[formData].props;
    props.formService.addForm({
      type: formData,
      props: { ...propData },
    });
  }
};
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
