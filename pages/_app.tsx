import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "../slices/index";
import theme from "../assets/theme/theme";
import "../styles/globals.css";
import Layout from "../components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
