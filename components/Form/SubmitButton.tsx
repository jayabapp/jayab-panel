import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

type PropTypes = {
  disabled: boolean;
  title?: string;
  onPress: (e: any) => void;
};
const SubmitButton = ({ disabled, title = "ثبت", onPress }: PropTypes) => {
  return (
    <Button
      color="primary"
      className="mt-6 px-6 text-lg !font-bold float-left ml-3"
      size="lg"
      startContent={<CloudArrowUpIcon className="w-6" />}
      disabled={disabled}
      isLoading={disabled}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

export default SubmitButton;
