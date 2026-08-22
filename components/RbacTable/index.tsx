import { AccessControlList, AccessControlModule } from "@/interfaces/schema.type";
import Loading from "../shared/Loading";
import { Checkbox } from "@nextui-org/react";
import { produce } from "immer";

type PropsType = {
  modules: AccessControlModule[];
  permissions: AccessControlList[];
  setPermissions: Function;
};
type CRUDType = "c" | "r" | "u" | "d" | "v";
const permissionTableHeaderTitles = [
  { id: 1, title: "ردیف" },
  { id: 2, title: "عنوان فارسی" },
  { id: 3, title: "عنوان انگلیسی" },
  { id: 4, title: "اضافه کردن" },
  { id: 5, title: "خواندن" },
  { id: 6, title: "ویرایش کردن" },
  { id: 7, title: "حذف کردن" },
  { id: 8, title: "مشاهده کردن" },
  { id: 9, title: "همه" },
];

const PermissionTable = ({ modules, permissions, setPermissions }: PropsType) => {
  const booleanFields: CRUDType[] = ["c", "r", "u", "d", "v"];

  /**
   * اگر موردی رو انتخاب کرد و در لیست دسترسی ها بود ویرایش میشه و انتخاب همه هم مجدد بررسی میشه
   * اگر در لیست نبود به دسترسی ها اضافه میشه
   * @param moduleId
   * @param action
   */
  const handleCheckboxChange = (moduleId: number, action: CRUDType) => {
    const nextState = produce(permissions, (draftState: AccessControlList[]): any => {
      const index = draftState.findIndex((e) => e.id == moduleId);
      if (index > -1) {
        const item = draftState[index];
        draftState[index][action] = !draftState[index][action];
        draftState[index].all = item.c && item.r && item.u && item.d && item.v;
      } else {
        draftState.push({
          id: moduleId,
          module_id: moduleId,
          c: false,
          r: false,
          u: false,
          d: false,
          v: false,
          [action]: true,
        });
      }
    });
    setPermissions(nextState);
  };

  /**
   * بررسی انتخاب همه
   * @param moduleId
   */
  const handleSelectAllChange = (moduleId: number) => {
    const nextState = produce(permissions, (draftState: AccessControlList[]): any => {
      const index = draftState.findIndex((e) => e.id == moduleId);
      if (index > -1) {
        const item = draftState[index];
        const status = item.all;
        draftState[index].c = !status;
        draftState[index].r = !status;
        draftState[index].u = !status;
        draftState[index].d = !status;
        draftState[index].v = !status;
        draftState[index].all = !status;
      } else {
        draftState.push({
          id: moduleId,
          module_id: moduleId,
          c: true,
          r: true,
          u: true,
          d: true,
          v: true,
        });
      }
    });

    setPermissions(nextState);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className={`bg-slate-50 dark:bg-slate-700 overflow-scroll`}>
        <tr>
          {permissionTableHeaderTitles?.map((e) => (
            <th
              key={e?.id}
              className={
                "border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center"
              }
            >
              {e?.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {modules?.map((module: AccessControlModule) => (
          <tr key={module?.id}>
            <td className=" border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400 text-sm  font-bold text-center py-3 w-[5rem]">
              {module?.id}
            </td>
            <td className="cell-container">{module?.name}</td>
            <td className="cell-container">{module?.key}</td>

            {booleanFields.map((field: CRUDType) => {
              const p: AccessControlList | undefined = permissions?.find((p) => p.id === module.id);

              return (
                <td key={field} className="cell-container">
                  <Checkbox
                    isSelected={p?.[field]}
                    onValueChange={() => handleCheckboxChange(module.id, field)}
                    color="success"
                  />
                </td>
              );
            })}

            <td className="cell-container">
              <Checkbox
                isSelected={permissions?.find((p) => p.id === module.id)?.all}
                onValueChange={() => handleSelectAllChange(module.id)}
                color="warning"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PermissionTable;
