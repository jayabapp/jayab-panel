import { memo, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type PropsType = {
  title: string;
  options?: {
    containerClass?: string;
    isMandatory?: boolean;
    titleClass?: string;
    titleHint?: string;
    disabled?: boolean;
    hint?: string;
    initValue?: boolean;
  };
  checked: boolean;
  onCheck: (checked: boolean) => void;
};
const FormSwitch = ({ title, options, checked, onCheck }: PropsType) => {
  //مقدار اولیه سوییچ
  useEffect(() => {
    if (checked == undefined && options?.initValue) onCheck(true);
  }, [checked]);

  return (
    <div className={options?.containerClass + " mb-4"}>
      <label
        htmlFor={`input-${title}`}
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title}
        <span className="fs-8 text-danger">{options?.titleHint}</span>
      </label>
      <div className="flex items-center mt-5">
        <Switch
          checked={checked}
          onChange={onCheck}
          disabled={options?.disabled}
          className={`${checked ? "bg-green-500" : "bg-gray-300 dark:bg-slate-500"}
          relative inline-flex h-[24px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-0`}
        >
          <span
            aria-hidden="true"
            className={`${!checked ? "-translate-x-8" : "translate-x-0"}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <div className="mr-3">{checked ? "بله" : "خیر"}</div>
      </div>
      {!!options?.hint && (
        <div className={`flex text-xs font-light text-warning mt-2 mr-1`}>
          <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
          <p>{options?.hint}</p>
        </div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: PropsType, nextProps: PropsType) {
  return prevProps.checked == nextProps.checked;
}
export default memo(FormSwitch, isEqualProps);
