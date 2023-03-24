import "@/styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalContextProvider } from "../context";
import { SSRProvider } from "@react-aria/ssr";

export default function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      <GlobalContextProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </GlobalContextProvider>
    </SSRProvider>
  );
}
