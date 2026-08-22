import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export interface props {
  value: string | number | undefined;
  onChangeText: (e: any) => void | null;

  item?: {
    title?: string;
    containerClass?: string;
    placeholder?: string;
    isPassword: boolean;
  };
}
const AuthInput = ({ item, value, onChangeText }: props) => {
  const [passwordType, setPasswordType] = useState(item?.isPassword ? "password" : "text");

  const handleType = () => {
    if (!item?.isPassword) return;
    if (passwordType == "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };
  return (
    <div className={(item?.containerClass || "w-full  mx-auto") + " mb-4  rounded-[8px]  text-gray-800  text-lg"}>
      <div className="flex items-center relative">
        <div
          className={`absolute cursor-pointer right-3 bottom-4`}
          onClick={() => {
            handleType();
          }}
        >
          {item?.isPassword && passwordType == "password" ? (
            <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : item?.isPassword ? (
            <EyeSlashIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <></>
          )}
        </div>

        {item?.isPassword ? (
          <LockClosedIcon className="absolute top-3 left-4 w-6 h-6 text-neutral-400 dark:text-gray-200" />
        ) : (
          <UserCircleIcon className="absolute top-3 left-4 w-6 h-6 text-neutral-400 dark:text-gray-200" />
        )}
        <input
          type={`${passwordType}`}
          className={`form-control  text-left   w-full text-lg font-medium !pl-12  py-3  border-2 border-gray-200 dark:border-slate-600`}
          style={{ direction: "rtl" }}
          id={`input-${item?.placeholder}`}
          placeholder={item?.placeholder || item?.title}
          onChange={(v) => onChangeText(v.target.value)}
          maxLength={100}
          value={value}
          onFocus={(event) => {
            event.target.setAttribute("autocomplete", "off");
          }}
        />
      </div>
    </div>
  );
};

export default AuthInput;
