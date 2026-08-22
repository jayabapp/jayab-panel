type MoreClassType = { moreClass?: string };

export const Divider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t border-gray-300 dark:border-gray-700 border-dashed  ${moreClass}`} />;
};
export const DivDivider = ({ moreClass }: MoreClassType) => {
  return <div className={` ${moreClass}`} />;
};
export const ShadowDivider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t shadow dark:shadow-slate-600 border-gray-300 dark:border-gray-700 ${moreClass}`} />;
};
export const RedDivider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t w-20 border-red-600 dark:border-red-600 my-5 h-1 bg-red-600 rounded ${moreClass}`} />;
};
export const PrimaryDivider = ({ moreClass }: MoreClassType) => {
  return (
    <hr
      className={`border-t w-40 border-primary-700 dark:border-primary-700 my-3 h-1 bg-primary-700 rounded ${moreClass}`}
    />
  );
};
