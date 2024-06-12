import { useRoutes } from "react-router-dom";
import OverviewPage from "../modules/overview/pages/OverviewPage";

import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../modules/flights/pages/FlightsPage";
import PricePage from "../modules/price/pages/PricesPage";
import AirlinePage from "../modules/airlines/pages/AirlinePage";
import PlanePage from "../modules/planes/pages/PlanePage";
import AdminChatDashboard from "../modules/chat/pages/AdminChatDashboard";
import VoucherPage from "../modules/vouchers/VoucherPage";


export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <OverviewPage />
        </MainLayout>
      ),
    },
    {
      path: "/airlines",
      element: (
        <MainLayout>
          <AirlinePage />
        </MainLayout>
      ),
    },
    {
      path: "/planes",
      element: (
        <MainLayout>
          <PlanePage />
        </MainLayout>
      ),
    },
    {
      path: "/flights",
      element: (
        <MainLayout>
          <FlightsPage />
        </MainLayout>
      ),
    },
    {
      path: "/price",
      element: (
        <MainLayout>
          <PricePage />
        </MainLayout>
      ),
    },
    {
      path: "/chat",
      element: (
        <MainLayout>
          <AdminChatDashboard />
        </MainLayout>
      ),
    },
    {
      path: "/voucher",
      element: (
        <MainLayout>
          <VoucherPage />
        </MainLayout>
      )
    },
    {
      path: "*",
      element: <h1>Not Found</h1>,
    },
  ]);

  return routeElements;
}
