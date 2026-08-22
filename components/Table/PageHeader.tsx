import { useRouter } from "next/navigation";
import { Divider } from "../shared/Divider";
import { PageHeaderType } from "./table.type";
import pluralize from "pluralize";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { kebabCase, snakeCase } from "lodash";
import { FileXls } from "@phosphor-icons/react";

const PageHeader = ({
  model,
  modelTitle,
  title,
  hasCreateButton = true,
  createRoute,
  hasBackButton = false,
  children,
  totalCount,
}: PageHeaderType) => {
  const router = useRouter();
  return (
    <div className="card  flex flex-wrap justify-between gap-4 items-center mb-3 lg:rounded-10 py-3 px-2 md:px-4">
      <p className="mx-0 font-bold  text-xl">
        {title || `${modelTitle} ها`}
        {!!totalCount && (
          <span className="mr-4 text-teal-500 font-bold">( {totalCount} )</span>
        )}
      </p>
      <div className="flex gap-3 flex-wrap items-center">
        {!!children && children}
        {hasCreateButton && (
          <Button
            color="primary"
            variant="solid"
            onPress={() =>
              router.push(
                createRoute || `/${pluralize(kebabCase(model) ?? "")}/create`,
              )
            }
            endContent={<PlusIcon className="w-6" />}
          >{`افزودن ${modelTitle}`}</Button>
        )}
        {hasBackButton && (
          <Button
            color="primary"
            variant="flat"
            onPress={() => router.back()}
            startContent={<ArrowRightCircleIcon className="w-6" />}
          >{`بازگشت`}</Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
