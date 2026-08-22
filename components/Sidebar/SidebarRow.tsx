import { useRouter } from "next/navigation";
import { SidebarRowMenu, phosphoreIconProps } from "./SidebarRowItems";
import { isEmpty, range } from "lodash";
import { Accordion, AccordionItem, Badge, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { SidebarStore, useSidebarStore } from "@/store";
import { ReactNode } from "react";
import { ClipboardText } from "@phosphor-icons/react";
import Link from "next/link";

type PropType = {
  item: SidebarRowMenu;
  isOpen: number;
  setIsOpen: Function;
  onSelect: Function;
};

const SidebarItem = ({ item, isOpen, setIsOpen, onSelect }: PropType) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = Boolean(pathname !== "/" && item?.route && pathname && item.route.includes(pathname));
  const { isSidebarOpen, badgeCount } = useSidebarStore((state: SidebarStore) => state);
  const hasAnyBadge: boolean = !!item.sub_categories?.some((e) => e.badgeKey && badgeCount[e.badgeKey] > 0);

  const _renderBadge = (badge: number) => {
    if (!badge) return <></>;
    return (
      <div className="min-w-[20px] w-fit text-center px-1 h-[20px] text-xs pt-1 bg-danger rounded-10 mr-2">{badge}</div>
    );
  };
  const _renderAccordion = (): ReactNode => {
    return item?.sub_categories?.map((e) => {
      return (
        <div
          key={e?.id}
          className={`px-3 py-3 rounded-l-20  w-full text-right right-0 ${
            pathname == e.route
              ? "bg-primary-700/10 dark:bg-primary-700/10 text-primary-700"
              : "hover:bg-neutral-100 dark:hover:bg-slate-600 "
          }`}
        >
          <Link
            href={e?.route || "#"}
            className={`cursor-pointer flex justify-start items-center  ${
              pathname == e.route ? "text-primary-700" : "text-gray-700 dark:text-white"
            }`}
            prefetch={true}
          >
            <div
              className={`w-2 h-2 mx-2 rounded-full ${
                pathname == e.route ? "bg-primary-700" : "bg-neutral-500 dark:bg-slate-400"
              }  `}
            />
            <>
              {e?.title}
              {_renderBadge(e.badgeKey ? badgeCount[e.badgeKey] : 0)}
            </>
          </Link>
        </div>
      );
    });
  };

  if (item?.sub_categories && !isEmpty(item?.sub_categories) && isSidebarOpen && !item.isHidden) {
    return (
      <Accordion>
        <AccordionItem
          key={item.id.toString()}
          title={
            isSidebarOpen ? (
              <div className="flex items-center gap-2">
                {item.title}
                {hasAnyBadge ? <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div> : <></>}
              </div>
            ) : (
              ""
            )
          }
          classNames={{
            title: "text-right text-sm app-text",
          }}
          startContent={item.icon ? item.icon(selected) : <ClipboardText {...phosphoreIconProps(false)} />}
          onPress={() => setIsOpen(isOpen == item?.id ? 0 : item?.id)}
        >
          {isSidebarOpen && _renderAccordion()}
        </AccordionItem>
      </Accordion>
    );
  } else {
    return (
      <Tooltip
        content={!isEmpty(item.sub_categories) ? _renderAccordion() : item.title}
        color="default"
        placement="left"
        isDisabled={isSidebarOpen}
        classNames={{
          base: "bg-neutral-100 dark:bg-slate-700 border-0 border-neutral-300 radius-xl dark:border-slate-700",
        }}
        offset={20}
      >
        <Link
          href={isEmpty(item.sub_categories) && item.route ? item.route : "#"}
          className={`w-full relative cursor-pointer flex justify-start items-center transition-all duration-200 ease-in-out  rounded-l-20
        ${selected ? "bg-primary-700/10 dark:bg-primary-700/10" : "hover:bg-neutral-100 dark:hover:bg-slate-600"}
        ${isSidebarOpen ? "my-3 px-2 py-3 flex-row" : "my-0.5 px-0 py-2 flex-col"}
        `}
        >
          {!!item?.icon ? item?.icon(selected) : ""}

          <p
            className={`font-medium  ${selected ? "text-primary-700" : "dark:text-neutral-100"} 
            ${isSidebarOpen ? "mr-3" : "px-1 text-[9px] mt-1 leading-4 text-center opacity-75"}`}
          >
            {item?.title}
          </p>
          {hasAnyBadge ? (
            <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-danger animate-pulse"></div>
          ) : (
            <></>
          )}
          {_renderBadge(item.badgeKey ? badgeCount[item.badgeKey] : 0)}
        </Link>
      </Tooltip>
    );
  }
};

export default SidebarItem;
