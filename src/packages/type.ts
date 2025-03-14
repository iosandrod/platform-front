export type FormEditorContext = {
    state: any;  // 根据 `state` 具体的结构替换 `any`
    setSelection: (selection: any) => void;  // 具体的参数类型替换 `any`
    props: Record<string, any>;  // 如果 `props` 是一个对象
    wrapElement: (element: any, index?: number, flag?: boolean, isBlock?: boolean) => any;
    delField: (fieldId: string) => void;
    addField: (field: any) => void;
    switchPlatform: (platform: string) => void;
    addFieldData: (data: any) => void;
    canvesScrollRef: HTMLDivElement; // 适用于 React 项目
    fireEvent: (eventName: string, payload?: any) => void;
    getData: () => any;
    form: any; // 根据 `form` 结构替换 `any`
    setValue: (field: any, value?: any) => void
};