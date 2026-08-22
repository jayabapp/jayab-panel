import { CreateProps } from "@/components/Table/table.type";
import { isEmpty } from "lodash";
import { p2e } from "../p2e";

export const apiBodyCreator = (states: any, formItems: CreateProps[] | undefined): any => {
  let body = {
    ...states,
  };

  for (const f of formItems || []) {
    const value = states[f.state];
    if (["image", "video"].includes(f.type) && f?.options?.multiImage && !isEmpty(value)) {
      let img = value?.map((_: any) => _.id);
      body[f.state] = img;
    } else if (["image", "video"].includes(f.type)) {
      let img = value?.map((_: any) => _.id);
      body[f.state] = img?.[0] || null;
    } else if (f.type == "select" && value) {
      body[f.state] = value.id;
    } else if (f.options?.keyboard == "number" && value) {
      body[f.state] = +p2e(value);
    } else if (f.type == "switch" && !value) {
      body[f.state] = false;
    } else if (f.type == "multiSelect" && Array.isArray(value)) {
      body[f.state] = value.map((e) => e.id);
    }
  }

  return body;
};
