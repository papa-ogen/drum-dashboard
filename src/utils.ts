export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [, month, day] = dateString.split("-");
  return `${month}/${day}`;
};
