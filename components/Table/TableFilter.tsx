import { CreateProps, Operator } from "./table.type";
import { Button } from "@nextui-org/react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import FormBuilder from "../Form/FormBuilder";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { useQueryGet } from "@/helpers/query-get.hooks";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import QueryString from "qs";

type PropTypes = {
  defaultValue?: object;
  filterProps: CreateProps[];
  onSubmitFilter: Function;
};
const TableFilter = ({ defaultValue, filterProps, onSubmitFilter }: PropTypes) => {
  const queriesParams = useQueryGet<any>();
  const [states, setStates] = useState(defaultValue || {});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);
  const [formItems, setFormItems] = useState<CreateProps[]>([]);

  useEffect(() => {
    setFormItems(filterProps?.filter((e) => !e.isHidden));
  }, [filterProps]);

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [filterProps, states]);

  function _onKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") prepareData();
  }

  /**
   * prepare disabled form
   */
  useEffect(() => {
    let list: string[] = [];
    filterProps.map((e) => {
      if (e.options?.disabled) list.push(e.state);
    });

    setNotEditableList(list);
  }, []);

  /**
   * prepare init data
   */
  useEffect(() => {
    let init = { ...(defaultValue || {}) };
    for (const key in queriesParams) {
      const f = filterProps.find((e) => e.state == key);
      if (f?.type == "select") {
        init = { ...init, [key]: f.selectItems?.find((_) => _.id == queriesParams[key]) || {} };
      } else if (f?.type === "switch")
        init = { ...init, [key]: ["true", "1"].includes(queriesParams[key]) ? true : false };
      else init = { ...init, [key]: queriesParams[key] };
    }
    setStates(init);
  }, [queriesParams]);

  const prepareData = () => {
    const data = apiBodyCreator(states, filterProps);
    onSubmitFilter(data);
  };
  return (
    <div className="card mb-6 lg:rounded-10 py-3 px-3 lg:px-4">
      <FormBuilder
        states={states}
        setStates={setStates}
        formItems={formItems}
        notEditableList={notEditableList}
        containerClass="grid-cols-2"
      />
      <div className="flex justify-end items-center gap-3">
        {/* <Button
          color="danger"
          variant="light"
          startContent={<TrashIcon className="w-6" />}
          size="sm"
          onPress={removeFilter}
        >
          حذف فیلتر
        </Button> */}
        <Button
          color="warning"
          variant="bordered"
          startContent={<FunnelIcon className="w-6" />}
          //   className="mr-auto flex"
          onPress={prepareData}
        >
          فیلتر
        </Button>
      </div>
    </div>
  );
};

export default TableFilter;
