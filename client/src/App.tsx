import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { ConfirmProvider } from "material-ui-confirm";
import { MotionLazyContainer } from "./components/animate";
import { ChartStyle } from "./components/chart";
import { ProgressBarStyle } from "./components/ProgressBar";
import ScrollToTop from "./components/ScrollToTop";
import Settings from "./components/settings";
import { ConfigurationProvider } from "./contexts/ConfigurationContext";
import { AuthProvider } from "./contexts/JWTContext";
import AppRouter from "./routes";
import ThemeProvider from "./theme";
import { customLink, trpc } from "./trpc";
import "react-toastify/dist/ReactToastify.css";

import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import ToastContainer from "./components/ToastContainer";
import { API_URL } from "./config";
import { getLoginToken } from "./utils/jwt";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: "always",
        networkMode: "always",
        keepPreviousData: true,
        retry: 0,
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      loggerLink(),
      customLink,
      httpBatchLink({
        url: API_URL + "/trpc/user",
        headers() {
          const Authorization = getLoginToken(true);
          return Authorization
            ? {
                Authorization,
              }
            : {};
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <ThemeProvider>
        <MotionLazyContainer>
          <ConfirmProvider>
            <ProgressBarStyle />
            <ChartStyle />
            <Settings />
            <ScrollToTop />
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ConfigurationProvider>
                  <ErrorBoundary>
                    <AppRouter />
                  </ErrorBoundary>
                </ConfigurationProvider>
              </AuthProvider>
              <ToastContainer />
            </QueryClientProvider>
          </ConfirmProvider>
        </MotionLazyContainer>
      </ThemeProvider>
    </trpc.Provider>
  );
};
export default App;
