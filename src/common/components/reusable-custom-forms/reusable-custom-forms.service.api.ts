import { E_FormType } from "../form-repository";

export interface I_FormListItem {
  type: E_FormType; // 控件类型
  props: any;
}
