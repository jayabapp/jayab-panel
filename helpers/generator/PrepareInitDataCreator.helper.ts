import { CreateProps } from "@/components/Table/table.type";

/**
 * اماده سازی مقادیر پیش فرض
 * در صورتی که فیلد ریلیشن داشته باشد از سمت بک کلید رف بر میگرده که با توجه به اون باید دیتای پیش فرض رو جایگذاری کرد
 * @param data
 * @param props
 */
export const prepareInitDataCreator = (data: any, props: CreateProps[]): any => {
  let s = {};
  for (const item of props) {
    let value;
    let d = data.find((e: any) => e.state == item.state);

    if (!d) continue;
    if (d.ref && ["video", "image"].includes(item.type)) {
      value = data.find((e: any) => e.state == d?.ref)?.value;
      value = !value ? [] : !Array.isArray(value) ? [value] : value;
    } else if (d.ref) value = data.find((e: any) => e.state == d.ref)?.value;
    else value = d.value;

    // console.log({ d, item, value });
    s = { ...s, [item.state]: value };
  }

  return s;
};
