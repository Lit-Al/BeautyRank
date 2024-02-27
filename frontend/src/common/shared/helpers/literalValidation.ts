export const literalValidation = (string: string) => {
  return /[^\p{L}]/u.test(string);
};
