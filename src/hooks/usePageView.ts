import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/services/firebase";


export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'view_page', {
      page_name: location.pathname
    });
  }, [location]);
}
