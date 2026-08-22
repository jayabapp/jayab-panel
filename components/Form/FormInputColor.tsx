import { isEmpty } from "lodash";
import React, { useRef, memo } from "react";
import Num2persian from "@/helpers/Num2Persian";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

type PropsType = {
  value: string | number | undefined;
  onChangeText: (e: any) => void | null;
  onRemoveValue?: () => void | null;
  title: string;
  options?: {
    containerClass?: string;
    titleClass?: string;
    hint?: string;
    placeholder?: string;
    titleHint?: string;
    inputClass?: string;
    keyboard?: "number" | "password" | "text";
    id?: number;
    maxLength?: number;
    isMandatory?: boolean;
    disabled?: boolean;
    convertToText?: boolean;
    unit?: string;
  };
};
const FormInputColor = ({ title, options, value, onChangeText, onRemoveValue }: PropsType) => {
  return (
    <div className={options?.containerClass + " mb-4"}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={`input-${options?.id}`}
          className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
            options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
          } ${options?.titleClass || ""}`}
        >
          {title}
          <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
        </label>
        <div className="text-xs text-red-500 cursor-pointer" onClick={onRemoveValue}>
          پاک کردن
        </div>
      </div>
      <div className="relative">
        <input
          type={"color"}
          className={`form-controld h-[42px] !py-0 !px-0 w-full  bg-transparent   ${options?.inputClass}
          } `}
          id={`input-${options?.id}`}
          onChange={(v) => onChangeText(v.target.value)}
          disabled={options?.disabled}
          value={value || ""}
        />
      </div>

      {!!options?.hint && (
        <div id={`${options?.id}`} className={`flex text-xs font-light text-warning mt-2 mr-1`}>
          <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
          <p>{options?.hint}</p>
        </div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: PropsType, nextProps: PropsType) {
  return prevProps.value == nextProps.value;
}
export default memo(FormInputColor, isEqualProps);
