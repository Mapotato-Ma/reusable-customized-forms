import { reactive } from 'vue';
import { I_FormListItem } from './reusable-custom-forms.service.api';
import { E_FormType, generateFormDefaultProps } from '../form-repository';

export class FormService {
  formDefaultProps: Record<E_FormType, any>;
  componentList = reactive<Array<I_FormListItem>>([]);
  constructor(changeDefaultProps?: any) {
    this.formDefaultProps = generateFormDefaultProps();
    if (changeDefaultProps) {
      Object.entries(changeDefaultProps).forEach(([key, value]) => {
        this.formDefaultProps[key as E_FormType] = { ...this.formDefaultProps[key as E_FormType], ...(value as any) };
      });
    }
  }
  addForm(form: I_FormListItem, index: number = Infinity) {
    this.componentList.splice(index, 0, form);
  }
  deleteForm(index: number) {
    this.componentList.splice(index, 1);
  }
}
