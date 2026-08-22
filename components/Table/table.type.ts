import { ReactNode } from "react";

export type EnumList = {
  title: string;
  id: string | number;
  hex: string;
  sub_title?: string;
};

export type AvailableAction = "create" | "show" | "edit" | "delete" | "custom";

export type TableServerProps = {
  model: string;
  modelTitle: string;
  columns: Column[];
  availableActions: Array<AvailableAction>;
};

export type Column = {
  id: number;
  title: string;
  cellType: CellType;
  key: string;
  nestedKey?: string;
  enumList?: Array<EnumList>;
  isEditable?: boolean;
  editableList?: string | Array<any>; //لیست مقادیر قابل انتخاب یا مسیر این لیست در ریسپانس
  update_key?: string; // کلیدی که در صورت پاس دادن به جای کلید اصلی در ای پی ای اپدیت استفاده می شود
  is_multiselect?: boolean; // برای حالتی که چند انتخابی نیاز داریم
  formOptions?: FormOptions;
  optionalClass?: string;
  link?: string;
  conditions?: ColCondition[];
  linkTitle?: string;
};

export type ColCondition = {
  operator: OperatorType;
  target: number | string | number[];
  className: string;
};

export type ColumnComponent = {
  id: number;
  component: () => JSX.Element;
};

export type TableProps = {
  data: any;
  columns: Column[];
  rows: Row[];
};

export type Row = {
  id: number;
  items: ColumnComponent[];
  actions?: ActionButton[];
};

export type ActionButton = {
  id: number;
  component: ReactNode;
};

export type CellProps = {
  value: any;
  cellType: CellType;
  optionalClass?: string;
  children?: ReactNode;
  link?: string;
  linkTitle?: string;
};

export type CellType =
  | "string"
  | "number"
  | "image"
  | "boolean"
  | "color"
  | "arrayOfStrings"
  | "html"
  | "object"
  | "date"
  | "dateTime"
  | "enum"
  | "colorfulList"
  | "link";

export type PageHeaderType = {
  model?: string;
  modelTitle?: string;
  title?: string;
  hasCreateButton?: boolean;
  createRoute?: string;
  hasBackButton?: boolean;
  hasExcelButton?: boolean;
  children?: ReactNode;
  totalCount?: number;
};

export type ShowPropsUnionType =
  | "string"
  | "longString"
  | "html"
  | "number"
  | "image"
  | "video"
  | "boolean"
  | "date"
  | "dateObject"
  | "list"
  | "map"
  | "chip"
  | "object"
  | "break"
  | "divider"
  | "dividerTitle"
  | "color";
export type ShowProps = {
  state?: string;
  title?: string;
  value?: any;
  type?: ShowPropsUnionType;
  isEditable?: boolean;
  isHidden?: boolean;
  nestedKey?: string;
  ref?: string;
  titleClass?: string;
  containerClass?: string;
  route?: string;
};

export type ShowAction = {
  title: string;
  route: string;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  targetBlank?: boolean;
};

export type CreateProps = {
  state: string;
  type:
    | "input"
    | "tagInput"
    | "textarea"
    | "colorInput"
    | "select"
    | "multiSelect"
    | "switch"
    | "date"
    | "image"
    | "video"
    | "editor"
    | "map"
    | "break"
    | "divider"
    | "dividerTitle";
  title: string;
  options?: FormOptions;
  selectItems?: Array<any>;
  searchRoute?: string;
  searchColumn?: string;
  isHidden?: boolean;
  fixQuery?: string;
};

export type FormOptions = {
  placeholder?: string;
  isMandatory?: boolean;
  containerClass?: string;
  extraButton?: string;
  titleClass?: string;
  hint?: string;
  titleHint?: string;
  inputClass?: string;
  keyboard?: "number" | "password" | "text";
  maxLength?: number;
  disabled?: boolean;
  convertToText?: boolean;
  rows?: number;
  multiImage?: boolean;
  unit?: string;
  property?: string;
  initValue?: boolean;
};

export type OperatorType =
  | "equals"
  | "contains"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "not"
  | "between";
export type Operator = {
  operator: OperatorType;
  types: Array<"string" | "number">;
};

export type FilterProp = {
  id: number;
  title: string;
  key: string;
  nestedKey?: string;
  type: "string" | "number" | "select";
  selectItems?: Array<any>;
  disabled?: boolean;
  isHidden?: boolean;
  operators: Array<Operator>;
  searchRoute?: string;
};
