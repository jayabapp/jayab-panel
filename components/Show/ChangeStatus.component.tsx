import { Button } from "@nextui-org/react";
import { EnumList, ShowAction, ShowProps } from "../Table/table.type";
import { useRouter } from "next/navigation";
import { Divider } from "../shared/Divider";
import { ArrowLeftCircleIcon, ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import FormBuilder from "../Form/FormBuilder";
import { CaretCircleLeft, FloppyDisk } from "@phosphor-icons/react";
import FormSelect from "../Form/FormSelect";
import FormInputMulti from "../Form/FormInputMulti";
import { ApiCall } from "@/helpers/ApiCall";
import FormInput from "../Form/FormInput";
import moment from "moment-jalaali";

type PropsType = {
  showProps: ShowProps[];
  endpoint: string;
  hideCondition: (number | string)[];
  onUpdate: () => void;
};
const ChangeStatus = ({ showProps, endpoint, hideCondition = [], onUpdate }: PropsType) => {
  const [status, setStatus] = useState<EnumList>();
  const [description, setDescription] = useState<string | undefined>();
  const [adminDescriptions, setAdminDescriptions] = useState([]);
  const [statusesList, setStatusesList] = useState<EnumList[]>([]);
  const [currentStatus, setCurrentStatus] = useState<EnumList | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);
  const [openDescription, setOpenDescription] = useState(true);

  useEffect(() => {
    const adminDescriptions = showProps.find((e: any) => e.state === "admin_descriptions")?.value as [];
    setAdminDescriptions(adminDescriptions);

    const statusesList = showProps.find((e: any) => e.state === "status_list")?.value as EnumList[];
    setStatusesList(statusesList);

    const status = showProps.find((e: any) => e.state === "status")?.value as EnumList;
    setStatus(status);

    setCurrentStatus(status);
  }, [showProps]);

  /* ------------------------------ SUBMIT ----------------------------- */
  const onSubmit = () => {
    setDisabled(true);

    let body = {
      status: status?.id,
      admin_description: description,
    };

    ApiCall(
      "PATCH",
      endpoint,
      body,
      "UPDATE STATUS",
      ({ data }) => {
        onUpdate();
        setDescription(undefined);
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (!currentStatus) return <></>;
  if (hideCondition.includes(currentStatus?.id)) return <></>;
  return (
    <div className="my-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-4">
        <FormSelect
          options={{}}
          value={status || {}}
          title="تغییر وضعیت"
          list={statusesList}
          onSelect={(value: any) => setStatus(value)}
          showX={false}
        />

        <FormInputMulti
          options={{
            titleHint: "(اخـتیاری)",
            placeholder: "مثلا: به دلیل اشتباه بودن شماره انجام نشد",
          }}
          value={description}
          title="توضیحات ادمین"
          onChangeText={(value: any) => setDescription(value)}
        />

        <Button
          color="primary"
          className="text-sm lg:mt-7 w-fit"
          size="lg"
          startContent={<FloppyDisk className="w-6 h-6" weight="regular" size={22} />}
          disabled={disabled}
          isLoading={disabled}
          onPress={() => onSubmit()}
        >
          ثبت
        </Button>
      </div>
      {!!adminDescriptions ? (
        <>
          <div className="my-8">
            <div className="flex items-center cursor-pointer" onClick={() => setOpenDescription((e) => !e)}>
              <h1 className="text-lg text-black dark:text-warning-300">تغییرات:</h1>
              <CaretCircleLeft
                className={`mr-2 text-warning ${openDescription ? "-rotate-90" : "rotate-0"} transition-all`}
                size={24}
                weight="fill"
              />
            </div>

            {openDescription && (
              <div className="transition-all">
                {isEmpty(adminDescriptions) ? (
                  <h1 className="text-medium my-10 text-gray-500 text-center">تغییری ثبت نشده</h1>
                ) : (
                  <div>
                    {adminDescriptions.map((e: any, i) => (
                      <div
                        className="flex flex-wrap items-center gap-3 text-sm text-gray-800 dark:text-gray-300"
                        key={i}
                      >
                        <p className="ltr" key={i}>
                          {e?.created_at && `${moment(e.created_at).format("jYYYY/jM/jD HH:mm")}`}
                        </p>
                        |
                        <p>
                          تغییر به:{" "}
                          <span className="mr-2 text-black dark:text-warning-300 font-medium">{e.status}</span>
                        </p>
                        |
                        <p>
                          توسط: <span className="mr-2">{e.admin_name}</span>
                        </p>
                        |
                        <p>
                          توضیحات: <span className="mr-2">{e.description}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      <Divider moreClass="my-4" />
    </div>
  );
};

export default ChangeStatus;
