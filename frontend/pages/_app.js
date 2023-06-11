import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import ConnectionLoader from "@/components/ConnectionLoader";

const { ToastContainer } = createStandaloneToast();

export default function App({ Component, pageProps }) {
  const [ready, setReady] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    setReady(true);

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconenct", onDisconnect);
    };
  }, []);

  return (
    <ChakraProvider>
      {!ready ? (
        <ConnectionLoader text="Loading" />
      ) : !isConnected ? (
        <ConnectionLoader text="Trying to connect" />
      ) : (
        <Component {...pageProps} />
      )}
      <ToastContainer />
    </ChakraProvider>
  );
}
