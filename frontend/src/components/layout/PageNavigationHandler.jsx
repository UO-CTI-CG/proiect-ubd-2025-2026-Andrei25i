import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PageNavigationHandler = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    toast.dismiss();
  }, [pathname]);

  return null;
}

export default PageNavigationHandler;
