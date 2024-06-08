import { useRoutes } from "react-router-dom";
import OverviewPage from "../modules/overview/pages/OverviewPage";

import MainLayout from "../layouts/MainLayout";
import ChatPage from "../modules/chat/pages/ChatPage";
import FlightsPage from "../modules/flights/pages/FlightsPage";
import PricePage from "../modules/price/pages/PricePage";
import AirlinePage from "../modules/airlines/pages/AirlinePage";
import PlanePage from "../modules/planes/pages/PlanePage";

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
          <ChatPage />
        </MainLayout>
      ),
    },
    {
      path: "*",
      element: <h1>Not Found</h1>,
    },
  ]);

  return routeElements;
}
