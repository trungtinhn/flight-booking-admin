import { useRoutes } from "react-router-dom";
import OverviewPage from "../modules/overview/pages/OverviewPage";

import MainLayout from "../layouts/MainLayout";
import ChatPage from "../modules/chat/pages/ChatPage";
import FlightsPage from "../modules/flights/pages/FlightsPage";

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
      path: "/flights",
      element: (
        <MainLayout>
          <FlightsPage />
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
