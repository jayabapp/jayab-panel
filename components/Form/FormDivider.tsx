export const FormDivider = () => {
  return <div className="col-span-full border-t border-gray-200 dark:border-slate-700 border-dashed" />;
};

export const FormBreak = () => {
  return <div className="col-span-full" />;
};

export const FormDividerTitle = ({ title }: { title: string }) => {
  return <div className="col-span-full font-medium text-lg">{title}</div>;
};
