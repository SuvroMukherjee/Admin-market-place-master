import { useEffect } from "react";

export const ScrollToTop = () => {
  const pathname = window.location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
