import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Calendar } from "@amir04lm26/react-modern-calendar-date-picker";
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";

import { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { DateType } from "@/interfaces/schema.type";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  convertGeorgianToJalaaliDateObject,
  convertJalaaliDtoToDate,
  JalaaliDateDto,
  startOfDate,
} from "@/helpers/date.helper";
import { X } from "@phosphor-icons/react";

type PropTypes = {
  value: Date | null;
  title: string;
  onSelect: Function;
  onRemoveValue?: () => void | null;
  options?: {
    containerClass?: string;
    titleClass?: string;
    hint?: string;
    titleHint?: string;
    isMandatory?: boolean;
    disabled?: boolean;
  };
};

export const FormDatePicker = ({
  title,
  value,
  options,
  onSelect,
  onRemoveValue,
}: PropTypes) => {
  const [selectedDate, setSelectedDate] = useState<JalaaliDateDto>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (value && moment(value).isValid())
      setSelectedDate(convertGeorgianToJalaaliDateObject(value));
  }, [value]);

  return (
    <>
      <div className={options?.containerClass + " mb-4"}>
        <label
          className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
            options?.isMandatory &&
            "after:content-['*'] after:mr-1 after:text-red-500"
          } ${options?.titleClass || ""}`}
        >
          {title}
          <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
          {!!selectedDate && (
            <span
              className="text-danger bg-danger-500/10 px-1 py-1 rounded-8 text-xs cursor-pointer"
              onClick={() => {
                typeof onRemoveValue === "function" && onRemoveValue();
                setSelectedDate(undefined);
              }}
            >
              حذف
            </span>
          )}
        </label>
        <div
          className="form-control font-normal w-full rounded-xl cursor-pointer"
          //   onClick={() => setIsVisible(true)}
          onClick={onOpen}
        >
          {!!selectedDate
            ? `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`
            : "تاریخ را انتخاب کنید"}
        </div>
        {!!options?.hint && (
          <div className={`flex text-xs font-light text-warning mt-2 mr-1`}>
            <ExclamationTriangleIcon className="text-warning w-3.5 ml-1" />
            <p>{options?.hint}</p>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="app-background w-full items-center flex justify-center">
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Calendar
              value={selectedDate}
              onChange={(e: JalaaliDateDto) => setSelectedDate(e)}
              shouldHighlightWeekends
              colorPrimary="#0DA1BE"
              locale="fa"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-fit px-12"
              onPress={() => {
                if (selectedDate)
                  onSelect(convertJalaaliDtoToDate(selectedDate));
                onOpenChange();
              }}
              disabled={!selectedDate}
            >
              تایید
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
