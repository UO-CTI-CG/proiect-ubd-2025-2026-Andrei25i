"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PageNavigationHandler = () => {
  const pathname = usePathname();

  useEffect(() => {
    toast.dismiss();
  }, [pathname]);

  return null;
}

export default PageNavigationHandler;
