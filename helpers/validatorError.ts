const validatorError = (err: object) => {
  if (!err) return null;
  const errors = Object.values(err);
  console.log({ errors });

  let result = "";
  if (Array.isArray(errors)) {
    const firstIndex: Array<string> = errors[0] as Array<string>;
    result = firstIndex[0] ?? "";
  }
  return result;
};

export default validatorError;
