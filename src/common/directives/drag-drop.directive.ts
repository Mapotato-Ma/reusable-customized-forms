import { fromEvent, filter } from 'rxjs';

/**
 * 拖拽签名
 */
const dragSign = new (class {
  private _sign: string | Symbol = Symbol();
  constructor() {
    fromEvent<MouseEvent>(document, 'mouseup').subscribe(() => (this._sign = Symbol()));
  }
  public set sign(v: string) {
    this._sign = v;
  }
  public get sign(): string | Symbol {
    return this._sign;
  }
})();

/**
 * 可拖拽指令
 */
export const vEasyDrag = {
  mounted(
    el: HTMLElement,
    binding: {
      value: {
        sign: string; // 关联的容器，可与注册vEasyDrop指令时中所传sign一致的容器建立数据通讯
        dragStartCallback: (e: DragEvent, ...args: Array<unknown>) => void; // 拖起来后触发的回调
        dragStartCallbackArgs?: Array<unknown>; // 拖起来后触发回调的剩余参数，无参数可不传
      };
    },
  ) {
    // 设置可拖拽属性
    el.setAttribute('draggable', 'true');
    fromEvent<DragEvent>(el, 'dragstart').subscribe((e) => {
      // 设置当前拖拽签名
      dragSign.sign = binding.value.sign;
      // 回调函数调用
      binding.value.dragStartCallback.call(this, e, ...(binding.value.dragStartCallbackArgs ?? []));
    });
  },
};

/**
 * 可落入指令
 */
export const vEasyDrop = {
  mounted(
    el: HTMLElement,
    binding: {
      value: {
        onEnterClass: string; // 落入时当前容器的类名
        sign: string; // 关联的容器，可与注册vEasyDrag指令时中所传sign一致的容器建立数据通讯
        dropCallback: (e: DragEvent, ...args: Array<unknown>) => void; // 落入后触发的回调
        dropCallbackArgs?: Array<unknown>; // 落入后触发回调的剩余参数，无参数可不传
      };
    },
  ) {
    // 是否可拖入
    const validateDrop = () => dragSign.sign === binding.value.sign;
    // 注册拖拽事件
    const [dragover$, dragenter$, dragleave$, drop$] = [
      fromEvent<DragEvent>(el, 'dragover').pipe(filter(() => validateDrop())),
      fromEvent<DragEvent>(el, 'dragenter').pipe(filter(() => validateDrop())),
      fromEvent<DragEvent>(el, 'dragleave').pipe(filter(() => validateDrop())),
      fromEvent<DragEvent>(el, 'drop').pipe(filter(() => validateDrop())),
    ];
    // 拖拽经过
    dragover$.subscribe((e) => e.preventDefault());
    // 拖拽移入
    dragenter$.subscribe((e) => {
      const target = e.target as HTMLElement;
      target.classList.add(binding.value.onEnterClass);
      target.classList.add('drop-zone-pointer-limit');
    });
    // 拖拽移出
    dragleave$.subscribe((e) => {
      const target = e.target as HTMLElement;
      target.classList.remove(binding.value.onEnterClass);
      target.classList.remove('drop-zone-pointer-limit');
    });
    // 拖拽落入
    drop$.subscribe((e) => {
      binding.value.dropCallback.call(this, e, ...(binding.value.dropCallbackArgs ?? []));
      const target = e.target as HTMLElement;
      target.classList.remove(binding.value.onEnterClass);
      target.classList.remove('drop-zone-pointer-limit');
    });
  },
};
