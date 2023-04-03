import "@/styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalContextProvider } from "../context";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/43852/nftmarket/v0.0.3",
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <GlobalContextProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </GlobalContextProvider>
    </ApolloProvider>
  );
}
