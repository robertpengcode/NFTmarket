import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { marketABI, marketAddress } from "../contract";
import { boredStudentsABI, boredStudentsAddress } from "../contract";
import { friendsABI, friendsAddress } from "../contract";
const ALCHEMY_MUMBAI_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_RPC_URL;
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [nft2Contract, setNft2Contract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [walletProvider, setWalletProvider] = useState(null);
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [updateUI, setUpdateUI] = useState(false);
  const [attributesCount, setAttributesCount] = useState({});
  const [signer, setSigner] = useState(null);

  //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [3000]);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Set the wallet address to the state
  //ethers.js v6
  // const updateAddress = async (accounts) => {
  //   if (accounts.length === 0) {
  //     window.localStorage.removeItem("connected");
  //     setWalletAddress(null);
  //     setContract(null);
  //   } else if (accounts[0] === walletAddress) {
  //     return;
  //   } else {
  //     setWalletAddress(accounts[0]);
  //     window.localStorage.setItem("connected", accounts[0]);
  //     const newProvider = new ethers.BrowserProvider(window.ethereum);
  //     const balance = await (
  //       await newProvider.getBalance(accounts[0])
  //     ).toString();
  //     const balanceInETH = ethers.formatEther(balance);
  //     setWalletBalance(balanceInETH);
  //     const signer = await newProvider.getSigner();
  //     const newContract = new ethers.Contract(marketAddress, marketABI, signer);
  //     const _nftContract = new ethers.Contract(
  //       boredStudentsAddress,
  //       boredStudentsABI,
  //       signer
  //     );
  //     const _nft2Contract = new ethers.Contract(
  //       friendsAddress,
  //       friendsABI,
  //       signer
  //     );
  //     setContract(newContract);
  //     setProvider(newProvider);
  //     setNftContract(_nftContract);
  //     setNft2Contract(_nft2Contract);
  //     const owner = (await newContract.owner()).toLowerCase();
  //     const isAdmin = owner === accounts[0];
  //     setIsAdmin(isAdmin);
  //   }
  // };

  const updateAddress = async (accounts) => {
    if (accounts.length === 0) {
      window.localStorage.removeItem("connected");
      setWalletAddress(null);
      setContract(null);
    } else if (accounts[0] === walletAddress) {
      return;
    } else {
      setWalletAddress(accounts[0]);
      window.localStorage.setItem("connected", accounts[0]);
      //const newProvider = new ethers.BrowserProvider(window.ethereum);
      const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
      //console.log("walletu", walletProvider);
      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        ALCHEMY_MUMBAI_RPC_URL
      );
      //console.log("Alchemyu", alchemyProvider);
      const newContract = new ethers.Contract(
        marketAddress,
        marketABI,
        alchemyProvider
      );
      const _nftContract = new ethers.Contract(
        boredStudentsAddress,
        boredStudentsABI,
        alchemyProvider
      );
      const _nft2Contract = new ethers.Contract(
        friendsAddress,
        friendsABI,
        alchemyProvider
      );
      setContract(newContract);

      setNftContract(_nftContract);
      setNft2Contract(_nft2Contract);
      //console.log("contractu", newContract);
      const signer = walletProvider.getSigner();
      //console.log("signeru", signer);
      setSigner(signer);
      const balance = await (
        await walletProvider.getBalance(accounts[0])
      ).toString();
      const balanceInETH = ethers.utils.formatEther(balance);
      setWalletBalance(balanceInETH);
      setWalletProvider(walletProvider);
      const owner = (await newContract.owner()).toLowerCase();
      const isAdmin = owner === accounts[0];
      setIsAdmin(isAdmin);
    }
  };

  //ethers.js v6
  // const restore = async () => {
  //   const newProvider = new ethers.BrowserProvider(window.ethereum);
  //   const account = window.localStorage.getItem("connected");
  //   setWalletAddress(account);
  //   const balance = await (await newProvider.getBalance(account)).toString();
  //   const balanceInETH = ethers.formatEther(balance);
  //   setWalletBalance(balanceInETH);
  //   const signer = await newProvider.getSigner();
  //   const newContract = new ethers.Contract(marketAddress, marketABI, signer);
  //   const _nftContract = new ethers.Contract(
  //     boredStudentsAddress,
  //     boredStudentsABI,
  //     signer
  //   );
  //   const _nft2Contract = new ethers.Contract(
  //     friendsAddress,
  //     friendsABI,
  //     signer
  //   );
  //   setContract(newContract);
  //   setProvider(newProvider);
  //   setNftContract(_nftContract);
  //   setNft2Contract(_nft2Contract);
  //   const owner = (await newContract.owner()).toLowerCase();
  //   const isAdmin = owner === account;
  //   setIsAdmin(isAdmin);
  // };

  const restore = async () => {
    //const newProvider = new ethers.BrowserProvider(window.ethereum);
    const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
    //console.log("walletr", walletProvider);
    const alchemyProvider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_MUMBAI_RPC_URL
    );
    //console.log("Alchemyr", alchemyProvider);
    const newContract = new ethers.Contract(
      marketAddress,
      marketABI,
      alchemyProvider
    );
    //console.log("contractr", newContract);
    const _nftContract = new ethers.Contract(
      boredStudentsAddress,
      boredStudentsABI,
      alchemyProvider
    );
    const _nft2Contract = new ethers.Contract(
      friendsAddress,
      friendsABI,
      alchemyProvider
    );
    setContract(newContract);
    setNftContract(_nftContract);
    setNft2Contract(_nft2Contract);
    const signer = walletProvider.getSigner();
    setSigner(signer);
    //console.log("signerr", signer);
    const account = window.localStorage.getItem("connected");
    setWalletAddress(account);
    //const balance = await (await newProvider.getBalance(account)).toString();
    //const balance = await (await walletProvider.getBalance(account)).toString();
    const balance = (await walletProvider.getBalance(account)).toString();
    const balanceInETH = ethers.utils.formatEther(balance);
    //console.log("bal", balanceInETH);
    setWalletBalance(balanceInETH);
    setWalletProvider(walletProvider);
    const owner = (await newContract.owner()).toLowerCase();
    const isAdmin = owner === account;
    setIsAdmin(isAdmin);
  };

  //ethers.js v6
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     const newProvider = new ethers.BrowserProvider(window.ethereum);
  //     const accounts = await newProvider.send("eth_requestAccounts", []);
  //     setWalletAddress(accounts[0]);
  //     const balance = await (
  //       await newProvider.getBalance(accounts[0])
  //     ).toString();
  //     const balanceInETH = ethers.formatEther(balance);
  //     setWalletBalance(balanceInETH);
  //     const signer = await newProvider.getSigner();
  //     window.localStorage.setItem("connected", accounts[0]);
  //     const newContract = new ethers.Contract(marketAddress, marketABI, signer);
  //     const _nftContract = new ethers.Contract(
  //       boredStudentsAddress,
  //       boredStudentsABI,
  //       signer
  //     );
  //     const _nft2Contract = new ethers.Contract(
  //       friendsAddress,
  //       friendsABI,
  //       signer
  //     );
  //     setProvider(newProvider);
  //     setContract(newContract);
  //     setNftContract(_nftContract);
  //     setNft2Contract(_nft2Contract);
  //     const owner = (await newContract.owner()).toLowerCase();
  //     const isAdmin = owner === accounts[0];
  //     setIsAdmin(isAdmin);
  //   } else {
  //     setErrorMessage("Please Install MetaMask!!!");
  //   }
  // };

  const connectWallet = async () => {
    if (window.ethereum) {
      //const newProvider = new ethers.BrowserProvider(window.ethereum);
      const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
      //console.log("wallet", walletProvider);
      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        ALCHEMY_MUMBAI_RPC_URL
      );
      //console.log("Alchemy", alchemyProvider);
      const newContract = new ethers.Contract(
        marketAddress,
        marketABI,
        alchemyProvider
      );
      //console.log("contract", newContract);
      const _nftContract = new ethers.Contract(
        boredStudentsAddress,
        boredStudentsABI,
        alchemyProvider
      );
      const _nft2Contract = new ethers.Contract(
        friendsAddress,
        friendsABI,
        alchemyProvider
      );
      setContract(newContract);
      setNftContract(_nftContract);
      setNft2Contract(_nft2Contract);
      const accounts = await walletProvider.send("eth_requestAccounts", []);
      const signer = walletProvider.getSigner();
      setSigner(signer);
      //console.log("signer", signer);
      setWalletAddress(accounts[0]);
      const balance = await (
        await walletProvider.getBalance(accounts[0])
      ).toString();
      const balanceInETH = ethers.utils.formatEther(balance);
      setWalletBalance(balanceInETH);
      setWalletProvider(walletProvider);
      window.localStorage.setItem("connected", accounts[0]);
      const owner = (await newContract.owner()).toLowerCase();
      const isAdmin = owner === accounts[0];
      setIsAdmin(isAdmin);
    } else {
      setErrorMessage("Please Install MetaMask!!!");
    }
  };

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };

  useEffect(() => {
    if (window.ethereum && window.localStorage.getItem("connected")) {
      restore();
    } else {
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
        nftContract,
        nft2Contract,
        walletAddress,
        walletBalance,
        setWalletBalance,
        connectWallet,
        isAdmin,
        walletProvider,
        showAlert,
        setShowAlert,
        updateUI,
        convertAddress,
        attributesCount,
        setAttributesCount,
        signer,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
