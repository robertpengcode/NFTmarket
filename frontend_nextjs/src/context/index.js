import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { marketABI, marketAddress } from "../contract";
import { boredStudentsAttributes } from "@/devData";

//import { useSubgraph } from "@/hooks/subgraph";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [provider, setProvider] = useState(null);

  //const { loading, error, data } = useSubgraph();

  //* Set the wallet address to the state
  const updateAddress = async (accounts) => {
    if (accounts.length === 0) {
      window.localStorage.removeItem("connected");
      setWalletAddress(null);
      setContract(null);
      //setIsPlayer(false);
    } else if (accounts[0] === walletAddress) {
      return;
    } else {
      setWalletAddress(accounts[0]);
      window.localStorage.setItem("connected", accounts[0]);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const balance = await (
        await newProvider.getBalance(accounts[0])
      ).toString();
      const balanceInETH = ethers.formatEther(balance);
      //console.log("balance", balanceInETH);
      setWalletBalance(balanceInETH);
      const signer = await newProvider.getSigner();
      const newContract = new ethers.Contract(marketAddress, marketABI, signer);
      setContract(newContract);
      setProvider(newProvider);
      const owner = (await newContract.owner()).toLowerCase();
      const isAdmin = owner === accounts[0];
      setIsAdmin(isAdmin);
    }
  };

  const restore = async () => {
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    const account = window.localStorage.getItem("connected");
    setWalletAddress(account);
    const balance = await (await newProvider.getBalance(account)).toString();
    const balanceInETH = ethers.formatEther(balance);
    //console.log("balance", balanceInETH);
    setWalletBalance(balanceInETH);
    const signer = await newProvider.getSigner();
    const newContract = new ethers.Contract(marketAddress, marketABI, signer);
    setContract(newContract);
    setProvider(newProvider);
    const owner = (await newContract.owner()).toLowerCase();
    const isAdmin = owner === account;
    setIsAdmin(isAdmin);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      const balance = await (
        await newProvider.getBalance(accounts[0])
      ).toString();
      const balanceInETH = ethers.formatEther(balance);
      //console.log("balance", balanceInETH);
      setWalletBalance(balanceInETH);
      const signer = await newProvider.getSigner();
      window.localStorage.setItem("connected", accounts[0]);
      const newContract = new ethers.Contract(marketAddress, marketABI, signer);
      setProvider(newProvider);
      setContract(newContract);
      const owner = (await newContract.owner()).toLowerCase();
      const isAdmin = owner === accounts[0];
      setIsAdmin(isAdmin);
    } else {
      setErrorMessage("Please Install MetaMask!!!");
    }
  };

  useEffect(() => {
    if (window.ethereum && window.localStorage.getItem("connected")) {
      restore();
    } else {
      //console.log('no need to do anything');
      return;
    }
  }, []);

  useEffect(() => {
    window?.ethereum?.on("accountsChanged", (accounts) =>
      updateAddress(accounts)
    );
  });

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        walletBalance,
        connectWallet,
        isAdmin,
        boredStudentsAttributes,
        provider,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
