import { Button } from "@nextui-org/react";
import { ShowAction } from "../Table/table.type";
import { useRouter } from "next/navigation";
import { Divider } from "../shared/Divider";
import { ArrowLeftCircleIcon, ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { isEmpty } from "lodash";

type PropsType = {
  actions: ShowAction[];
};
const ShowActions = ({ actions }: PropsType) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-wrap items-center justify-start gap-3 mt-6">
        {actions?.map((act, i) => (
          <Button
            key={i}
            color={act.color || "warning"}
            variant="solid"
            endContent={<ArrowLeftCircleIcon className="w-5 shrink-0" />}
            // onPress={() => (act.route ? router.push(act.route) : void null)}
            onPress={() => {
              if (!act.route) return;
              if (act.targetBlank) window.open(act.route, "_blank");
              else router.push(act.route);
            }}
          >
            {act.title}
          </Button>
        ))}
      </div>
      {!isEmpty(actions) && <Divider moreClass="my-6" />}
    </>
  );
};

export default ShowActions;
