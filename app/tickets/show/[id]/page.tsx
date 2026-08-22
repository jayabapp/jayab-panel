"use client";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { NestedText } from "@/components/shared/NestedText";
import { Divider } from "@/components/shared/Divider";
import FormInputMulti from "@/components/Form/FormInputMulti";
import { Button } from "@nextui-org/react";
import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from "react-textarea-autosize";
import { PaperPlaneRight } from "@phosphor-icons/react";
import moment from "moment-jalaali";
import { useSidebarStore } from "@/store";
import Notify from "@/components/shared/Toast";
import Link from "next/link";

const TicketDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const isSidebarOpen = useSidebarStore((state: any) => state.isSidebarOpen);

  const repliesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState<any>();
  // const [title, setTitle] = useState(null);
  // const [message, setMessage] = useState(null);
  // const [status, setStatus] = useState(null);
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getTicketDetails();
  }, []);

  useEffect(() => {
    if (repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replies]);

  /* -------------------------------- GET TICKET ------------------------------- */
  const getTicketDetails = () => {
    ApiCall(
      "GET",
      `/admin/tickets/${id}`,
      null,
      "GET SINGLE TICKET",
      ({ data }) => {
        setData(data);
        setReplies(data?.replies);
        setIsLoading(false);
      }
    );
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  /* -------------------------------- PUT REPLY IF MESSAGE DOESN'T HAVE ONE ------------------------------- */
  function onSubmit() {
    setDisable(true);
    const body = {
      message: text,
    };

    ApiCall(
      "PATCH",
      `/admin/tickets/${id}`,
      body,
      "PUT REPLY",
      ({ data }) => {
        setText("");
        setDisable(false);
        getTicketDetails();
      },
      (err) => {
        console.log(err.data);
        setDisable(false);
      }
    );
  }

  const onChangeStatus = () => {
    setDisable(true);

    ApiCall(
      "PUT",
      `/admin/tickets/${id}`,
      null,
      "CLOSE TICKET",
      ({ data }) => {
        setDisable(false);
        // router.back();
      },
      (err) => {
        setDisable(false);
      }
    );
  };

  if (isLoading || !data) {
    return <Loading />;
  }
  return (
    <div className="app-container-profiles !overflow-hidden ">
      {/*********************** PAGE HEADER ************************/}
      <div>
        <PageHeader
          title={`جــزییـات تیکت شماره ${data.id}:`}
          hasCreateButton={false}
          hasBackButton={true}
        >
          <>
            {data.status !== 100 && (
              <div>
                <Button
                  title={"بستن تیکت"}
                  onClick={() => onChangeStatus()}
                  disabled={disable}
                  isLoading={disable}
                  color="danger"
                  startContent={<XMarkIcon className="w-6" />}
                >
                  بستن تیکت
                </Button>
              </div>
            )}
          </>
        </PageHeader>
      </div>

      <div className="">
        <NestedText
          firstText={"عنوان"}
          secondText={data.title}
          secondTextStyle="text-warning text-lg font-bold"
        />
        <NestedText firstText={"متن"} secondText={data.message} />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Link
          href={`/users/edit/${data.user.id}`}
          className="text-blue-600 underline"
          target="_blank"
          prefetch={false}
        >
          جــزییـات کاربر
        </Link>
        {data?.user?.advisor_id && (
          <Link
            href={`/advisors/show/${data.user.advisor_id}`}
            className="text-blue-600 underline"
            target="_blank"
            prefetch={false}
          >
            جــزییـات مشاور
          </Link>
        )}
        {data?.user?.owner_id && (
          <Link
            href={`/owners/show/${data.user.owner_id}`}
            className="text-blue-600 underline"
            target="_blank"
            prefetch={false}
          >
            جــزییـات مالک
          </Link>
        )}
      </div>
      <div className="mx-auto" style={{ maxWidth: 500 }}>
        <div className="mx-auto borderd dark:border-gray-600 rounded-10  px-4 py-4 flex flex-col  mt-6 dark:bg-slate-900 overflow-y-scroll">
          <div className="">
            {replies?.map((item: any) => {
              const isMine = item.by_admin;
              return (
                <div
                  key={item.id}
                  className={`w-[70%] text-start my-1.5 text-black relative rounded-xl h-fit px-4 py-2 
                 ${
                   isMine
                     ? "bg-[#075E54] self-start text-white rounded-br-none"
                     : "bg-zinc-700 self-end text-white rounded-bl-none"
                 }`}
                >
                  <p className="whitespace-pre-line">{item.message}</p>
                  <p className="text-[10px] text-left opacity-75 ltr mt-1 leading-3">
                    {moment(item.created_at).format("jYYYY/jMM/jDD HH:mm")}
                  </p>
                </div>
              );
            })}
          </div>
          <div ref={repliesEndRef} />
        </div>

        <div
          className={`fixed bottom-0 mx-auto left-0 right-0 ${
            isSidebarOpen ? "lg:right-[300px]" : "lg:right-[80px]"
          }  flex justify-between items-center bg-white dark:bg-slate-900 w-full rounded-b-lg border borde-gray-100 shadow-lg dark:border-slate-700`}
          style={{ maxWidth: 500 }}
        >
          <TextareaAutosize
            rows={1}
            placeholder={"پـیام..."}
            className={`flex-grow bg-transparent px-3 py-3`}
            onChange={handleTextChange}
            value={text}
            minRows={1}
            maxRows={3}
            style={{ resize: "none" }}
          />
          <div className="cursor-pointer">
            {!!text ? (
              <PaperPlaneRight
                className={`rotate-180 ml-3 ${
                  !!text ? "text-teal-600" : "text-gray-400"
                }`}
                size={26}
                weight="fill"
                onClick={onSubmit}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
