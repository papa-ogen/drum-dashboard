export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });
