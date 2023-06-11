import "@/styles/globals.css";

import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
const { ToastContainer } = createStandaloneToast();

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ChakraProvider>
  );
}
