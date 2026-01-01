let pendingDeepLink: string | null = null;

export const setPendingDeepLink = (url: string) => {
  pendingDeepLink = url;
};

export const consumePendingDeepLink = () => {
  const url = pendingDeepLink;
  pendingDeepLink = null;
  return url;
};
