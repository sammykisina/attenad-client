import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import { Layout } from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default MyApp;
