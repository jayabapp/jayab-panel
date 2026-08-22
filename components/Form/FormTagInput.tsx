import { isEmpty } from "lodash";
import React, { useRef, memo } from "react";
import Num2persian from "@/helpers/Num2Persian";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { TagsInput } from "react-tag-input-component";

type PropsType = {
  value: string | number | undefined;
  errorKey?: string;
  onChange: (e: any) => void | null;
  errors?: { [key: string]: string[] };
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
const FormTagInput = ({ title, options, value, onChange, errors, errorKey = "" }: PropsType) => {
  const arrayValue = (value || []) as unknown as Array<string>;
  return (
    <div className={options?.containerClass + " mb-4"}>
      <label
        htmlFor={`input-${options?.id}`}
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title}
        <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
      </label>
      <div className="relative">
        <TagsInput
          value={arrayValue}
          onChange={onChange}
          placeHolder={options?.placeholder || "مقدار را وارد کنید"}
          classNames={{
            input: "form-control !bg-gray-200 dark:!bg-slate-900  font-normal !w-full rounded-xl ",
            tag: "app-text !px-2 !py-1.5 !bg-gray-300 dark:!bg-slate-700",
          }}
        />
        {!!options?.unit && (
          <div className="absolute -left-1 top-0 rounded-l-xl h-full w-fit bg-neutral-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-center flex justify-center items-center px-2">
            {options?.unit}
          </div>
        )}
      </div>

      {!!options?.hint && (
        <div className={`flex text-xs font-light text-warning mt-2 mr-1`}>
          <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
          <p>{options?.hint}</p>
        </div>
      )}

      {!!errors && !!errors[errorKey] && (
        <div className={`text-xs text-red-100  mt-2 mr-5  `}>{errors[errorKey]?.map((e: string) => e)}</div>
      )}
      {!!options?.convertToText && (
        <div className="text-xs text-danger text-right mt-1">{value ? Num2persian(value) : "بدون مقدار"}</div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: PropsType, nextProps: PropsType) {
  return prevProps.value == nextProps.value;
}
export default memo(FormTagInput, isEqualProps);
