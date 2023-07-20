import { reactive } from 'vue';
import { I_FormListItem } from './reusable-custom-forms.service.api';

export class FormService {
  componentList = reactive<Array<I_FormListItem>>([]);
  addForm(form: I_FormListItem, index: number = Infinity) {
    this.componentList.splice(index, 0, form);
  }
  deleteForm(index: number) {
    this.componentList.splice(index, 1);
  }
}
