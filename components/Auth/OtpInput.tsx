import React, { useMemo, useState, ReactNode } from "react";
interface props {
  setValue: (e: any) => void | null;
  refresh?: boolean;
  timer?: () => ReactNode;
}
interface inputType {
  [key: string]: string;
}
function OtpInput({ setValue, refresh = false, timer }: props): JSX.Element {
  // type inputs= inputType;
  // type setInputs= any;

  const [inputs, setInputs] = useState<inputType>({
    value1: "",
    value2: "",
    value3: "",
    value4: "",
    value5: "",
  });
  //   const [input6, setInput6] = useState("");

  useMemo(() => {
    setValue(`${inputs.value1}${inputs.value2}${inputs.value3}${inputs.value4}${inputs.value5}`);
  }, [inputs]);
  useMemo(() => {
    setInputs({
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
    });
  }, [refresh]);
  const handleNextInput = (e: any) => {
    const fieldName = e.target.id;
    const fieldvalue = e.target.value;
    const nextSibiling = document.getElementById(`${Number(fieldName) + 1}`);

    if (nextSibiling !== null && fieldvalue.length > 0) {
      nextSibiling.focus();
    }
  };
  const handleLastInput = (e: any) => {
    const fieldName = e.target.id;
    const fieldvalue = e.target.value;
    const nextSibiling = document.getElementById(`${Number(fieldName) - 1}`);

    if (nextSibiling !== null && fieldvalue.length == 0) {
      nextSibiling.focus();
    }
  };

  const values = ["value1", "value2", "value3", "value4", "value5"];
  return (
    <div className="w-full flex flex-col gap-4">
      {" "}
      <div id="otp" className="flex flex-row justify-between items-center text-center mt-5 direction-ltr ">
        {values?.map((field, index) => (
          <input
            key={index}
            autoFocus={index == 0 ? true : false}
            className={`border border-gray-200 text-black text-lg lg:text-2xl font-medium  !bg-primary-700/5   focus:border-primary-700 w-10 h-10 lg:h-16 lg:w-16 text-center form-control rounded-lg mx-3`}
            type="number"
            id={`${index + 1}`}
            maxLength={1}
            value={inputs[field]}
            onChange={(e) => {
              if (e.target.value.length <= 1) {
                inputs[field] = e.target.value;
                setInputs({ ...inputs });
              }
            }}
            onKeyUp={(e) => {
              if (e?.code == "Backspace" || e?.code == "Delete" || e?.keyCode == 8) {
                handleLastInput(e);
              } else {
                handleNextInput(e);
              }
            }}
          />
        ))}
      </div>
      {timer && timer()}
    </div>
  );
}

export default OtpInput;
