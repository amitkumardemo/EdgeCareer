import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { BUTTONS_MENUS } from "@/lib/constants";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">{BUTTONS_MENUS.DASHBOARD_INSIGHTS}</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
