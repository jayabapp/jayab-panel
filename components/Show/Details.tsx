import moment from "moment-jalaali";
import Loading from "../shared/Loading";
import numberWithCommas from "@/helpers/NumberWithCommas";
import { ShowProps, ShowPropsUnionType } from "../Table/table.type";
import { Chip, Divider } from "@nextui-org/react";
import { SyntheticEvent } from "react";
import Map, { RegionType } from "../Map";
import hexToRgbA from "@/helpers/hexToRgba";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { PrimitiveObject } from "@/interfaces/schema.type";
import ShowImage from "./ShowImage";

const Detail = ({ data }: { data: ShowProps[] }) => {
  const findValue = (e: ShowProps): string => {
    const type = e.type;
    const value = e.value;
    const nestedKey = e.nestedKey;

    let result;
    switch (type) {
      case "date":
        result = value ? moment(value).format("jYYYY/jMM/jDD HH:mm") : "❌";
        break;
      case "number":
        result = numberWithCommas(value as string) ?? "❌";
        break;
      case "image":
        result = value;
        break;
      case "object":
        if (!nestedKey) result = "Please define nestedKey";
        else if (value && typeof value == "object") result = (value as PrimitiveObject)[nestedKey];
        else result = "❌";
        break;
      default:
        result = value;
        break;
    }
    return result as string;
  };
  if (!data) return <Loading />;
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
        {data.map((e, i) => {
          if (e.type == "divider")
            return (
              <div className="col-span-full h-[1px] border-t border-dashed border-gray-200 dark:border-slate-700" />
            );
          if (e.type == "break") return <div className="col-span-full" />;
          if (e.type == "dividerTitle")
            return <div className={`col-span-full font-medium text-lg text-teal-400 ${e.titleClass}`}>{e.title}</div>;
          if (e.type == "boolean")
            return (
              <div className="flex items-center">
                <p className="font-light ml-2">{e.title}:</p>
                {e.value ? (
                  <CheckBadgeIcon className="w-6 text-teal-500" />
                ) : (
                  <XCircleIcon className="w-6 text-danger" />
                )}
              </div>
            );
          if (e.type == "image") {
            let arr = [];
            if (e.value) arr = !Array.isArray(e.value) ? [e.value] : e.value || [];
            return (
              <div key={e.state} className="col-span-full">
                <p className="font-light mb-2">{e.title}:</p>
                <div className="flex flex-wrap justify-start gap-2 items-center">
                  {arr.map((img) => (
                    <ShowImage key={img.id} image={img} />
                  ))}
                </div>
              </div>
            );
          }
          if (e.type == "video") {
            let arr = [];
            if (e.value) arr = !Array.isArray(e.value) ? [e.value] : e.value || [];
            return (
              <div key="">
                <p className="font-light mb-2">{e.title}:</p>
                <div className="flex justify-start items-center">
                  {arr.map((video) => (
                    <div key={video.id}>
                      <a
                        className="w-fit"
                        href={`https://${video?.end_point}/${video?.bucket}/${video?.path}/${video?.name}`}
                        target="_blank"
                        rel="norefferer"
                      >
                        <video className="w-44  m-2 rounded-8 object-contain  " controls>
                          <source src={`https://${video?.end_point}/${video?.bucket}/${video?.path}/${video?.name}`} />
                        </video>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (e.type == "list") {
            const value = e.value as Array<any>;
            return (
              <div key="list" className="flex justify-start items-center py-2 col-span-full gap-2">
                <p className="font-light">{e.title}:</p>
                {value?.map((e: any) => (
                  <Chip color="primary" variant="flat" className="" key={e.id}>
                    {e.title}
                  </Chip>
                ))}
              </div>
            );
          }
          if (e.type == "map") {
            const value = e.value as RegionType;
            return (
              <Map
                key="map"
                title={e.title || ""}
                initLoc={value}
                onDragEnd={() => void null}
                options={{
                  containerClass: "col-span-full",
                  disableSearch: true,
                }}
              />
            );
          }
          if (e.type == "chip") {
            const value = e.value as { title: string; hex: string };
            return (
              <div key="chip" className="flex justify-start items-center py-2">
                <p className="font-light">{e.title}:</p>
                <div
                  className={`py-1.5 px-1.5 rounded-8 mr-3`}
                  style={{
                    background: hexToRgbA(value?.hex, 0.1) || "transparent",
                    color: value?.hex,
                  }}
                >{`${value?.title}`}</div>
              </div>
            );
          }
          if (e.type == "html") {
            return (
              <div
                key={i}
                className="flex justify-start  py-4 col-span-full px-4 border border-gray-100 dark:border-slate-500 rounded-10"
              >
                <div dangerouslySetInnerHTML={{ __html: e.value || "" }} />
              </div>
            );
          }
          if (e.type == "longString") {
            return (
              <div key={i} className="flex justify-start  py-2 col-span-full">
                <p className="font-light ml-2">{e.title}:</p>
                <p className={`mr-1.5 text-md text-justify font-light leading-8 ${e.titleClass}`}>
                  {findValue(e) ?? "❌"}
                </p>
              </div>
            );
          } else {
            return (
              <a key={i} href={e.route} target="_blank">
                <div className={`flex justify-start items-center py-2 ${e.containerClass}`}>
                  <p className="font-light">{e.title}:</p>
                  <p
                    className={`mr-1.5 text-warning font-medium text-md ${e.route && "underline underline-offset-4"} ${
                      e.titleClass
                    }`}
                  >
                    {findValue(e) ?? "❌"}
                  </p>
                </div>
              </a>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Detail;
