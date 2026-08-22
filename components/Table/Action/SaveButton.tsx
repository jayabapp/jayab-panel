import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";

const SaveButton = ({
  disabled,
  isChanged = false,
  onPress,
}: {
  disabled: boolean;
  isChanged: boolean;
  onPress: any;
}) => {
  return (
    <Button
      color={isChanged ? "primary" : "default"}
      variant="solid"
      size="sm"
      startContent={<CheckCircleIcon className="w-4" />}
      className="w-24 font-medium"
      isDisabled={disabled || !isChanged}
      onPress={onPress}
    >
      ذخیره
    </Button>
  );
};

export default SaveButton;
