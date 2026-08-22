import { Button } from "@nextui-org/react";
import { FileXls } from "@phosphor-icons/react";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const ExcelButton = ({ onPress, isLoading = false }: Props) => {
  return (
    <Button
      color="success"
      variant="flat"
      isLoading={isLoading}
      onPress={onPress}
      startContent={<FileXls size={22} className="" weight="regular" />}
    >{`دریافت اکسل`}</Button>
  );
};

export default ExcelButton;
