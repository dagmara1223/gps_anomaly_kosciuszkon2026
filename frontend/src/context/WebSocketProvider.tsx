import React, { createContext, useContext, useEffect, useState } from "react";

type Packet = {
  PRN: number;
  CN0: number;
  DO: number;
  Output: number;
};

type WSContextType = {
  latest: Packet | null;
  sendMessage: (msg: unknown) => void;
};

const WSContext = createContext<WSContextType>({
  latest: null,
  sendMessage: () => {}
});

export const useWS = () => useContext(WSContext);

export const WebSocketProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [latest, setLatest] = useState<Packet | null>(null);

  useEffect(() => {
    let t = 0;

    const interval = setInterval(() => {
      const spoof = t > 12 && t < 22 ? 1 : 0;

      setLatest({
        PRN: 6,
        CN0: spoof ? 39 + Math.random() : 49 + Math.random(),
        DO: spoof ? 1080 + Math.random() * 10 : 1150 + Math.random() * 5,
        Output: spoof
      });

      t++;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (msg: unknown) => {
    console.log("SEND TO BACKEND:", msg);
  };

  return (
    <WSContext.Provider value={{ latest, sendMessage }}>
      {children}
    </WSContext.Provider>
  );
};