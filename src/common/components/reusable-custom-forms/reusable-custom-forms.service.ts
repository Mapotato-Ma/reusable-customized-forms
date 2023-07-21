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
  moveForm(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && this.componentList[index - 1] !== undefined) {
      [this.componentList[index - 1], this.componentList[index]] = [
        this.componentList[index],
        this.componentList[index - 1],
      ];
    } else if (direction === 'down' && this.componentList[index + 1] !== undefined) {
      [this.componentList[index], this.componentList[index + 1]] = [
        this.componentList[index + 1],
        this.componentList[index],
      ];
    }
  }
}
