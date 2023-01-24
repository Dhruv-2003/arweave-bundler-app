import "../styles/globals.css";
import { MainContext } from "../context";
import { providers, utils } from "ethers";
import { WebBundlr } from "@bundlr-network/client";
import { useState, useEffect, useRef } from "react";

export default function App({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState();
  const bundlrRef = useRef();
  const [balance, setBalance] = useState();

  async function initialize() {
    await window.ethereum.enable();

    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();

    const bundlr = new WebBundlr(
      "https://devnet.bundlr.network",
      "matic",
      provider,
      {
        providerUrl: "https://rpc-mumbai.matic.today",
      }
    );
    await bundlr.ready();
    console.log(bundlr);
    setBundlrInstance(bundlr);
    bundlrRef.current = bundlr;
    fetchBalance();
    return bundlr; // done!
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance();
    console.log("bal: ", utils.formatEther(bal.toString()));
    setBalance(utils.formatEther(bal.toString()));
  }

  return (
    <div>
      <MainContext.Provider
        value={{ initialize, bundlrInstance, bundlrRef, balance, fetchBalance }}
      >
        <Component {...pageProps} />
      </MainContext.Provider>
    </div>
  );
}
