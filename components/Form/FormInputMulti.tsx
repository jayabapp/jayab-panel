import { useRef, memo } from "react";
import Num2persian from "@/helpers/Num2Persian";
type Props = {
  value: string | number | undefined;
  errorKey?: string;
  onChangeText: (e: any) => void | null;
  errors?: { [key: string]: string[] };
  title: string;
  options: {
    containerClass?: string;
    rows?: number;
    titleClass?: string;
    hint?: string;
    placeholder?: string;
    titleHint?: string;
    inputClass?: string;
    keyboard?: string;
    maxLength?: number;
    isMandatory?: boolean;
    disabled?: boolean;
    convertToText?: boolean;
  };
};
const FormInputMulti = ({
  title,
  options,
  value,
  onChangeText,
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = options.maxLength ?? 2048;
  return (
    <div className={(options.containerClass || "w-full mx-auto") + " mb-4"}>
      <label
        // htmlFor={`input-${options?.id}`}
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory &&
          "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title || ""}
        <span className="fs-8 text-danger">{options?.titleHint}</span>
      </label>
      <textarea
        ref={inputRef}
        inputMode={options.keyboard == "number" ? "tel" : "text"}
        className={`form-control font-norma py-3 px-4 w-full rounded-xl placeholder:text-gray-400   placeholder:font-light placeholder:text-sm placeholder:opacity-70 dark:placeholder:text-slate-300  ${options?.inputClass}`}
        placeholder={options.placeholder || title || ""}
        onChange={(v) => {
          if (options.keyboard != "number") onChangeText(v.target.value);
          else if (!isNaN(Number(v.target.value))) onChangeText(v.target.value);
          if (v.target.value.length >= maxLength) inputRef?.current?.blur();
        }}
        rows={options.rows || 4}
        maxLength={options.maxLength || 2048}
        disabled={options.disabled}
        value={value || ""}
        onFocus={(event) => {
          event.target.setAttribute("autocomplete", "off");
        }}
      />
      {!!options.hint && (
        <div className="text-[10px] text-gray-400 mt-1">{options.hint}</div>
      )}
      {!!options.convertToText && !!value && (
        <div className="text-sm text-primary mt-1">{Num2persian(value)}</div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: Props, nextProps: Props) {
  return prevProps.value == nextProps.value;
}
export default memo(FormInputMulti, isEqualProps);
