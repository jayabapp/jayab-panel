import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type PropsType = {
  message: string;
};
const OrderWarning = ({ message }: PropsType) => {
  return (
    <>
      <div className="flex my-2">
        <ExclamationTriangleIcon className="w-3 ml-2 text-warning" />
        <p>{message}</p>
      </div>
    </>
  );
};

export default OrderWarning;
