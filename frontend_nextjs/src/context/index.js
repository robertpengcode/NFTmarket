import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { marketABI, marketAddress } from "../contract";
import { boredStudentsABI, boredStudentsAddress } from "../contract";
import { friendsABI, friendsAddress } from "../contract";
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [nft2Contract, setNft2Contract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [provider, setProvider] = useState(null);

  //* Set the wallet address to the state
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
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const balance = await (
        await newProvider.getBalance(accounts[0])
      ).toString();
      const balanceInETH = ethers.formatEther(balance);
      setWalletBalance(balanceInETH);
      const signer = await newProvider.getSigner();
      const newContract = new ethers.Contract(marketAddress, marketABI, signer);
      const _nftContract = new ethers.Contract(
        boredStudentsAddress,
        boredStudentsABI,
        signer
      );
      const _nft2Contract = new ethers.Contract(
        friendsAddress,
        friendsABI,
        signer
      );
      setContract(newContract);
      setProvider(newProvider);
      setNftContract(_nftContract);
      setNft2Contract(_nft2Contract);
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
    setWalletBalance(balanceInETH);
    const signer = await newProvider.getSigner();
    const newContract = new ethers.Contract(marketAddress, marketABI, signer);
    const _nftContract = new ethers.Contract(
      boredStudentsAddress,
      boredStudentsABI,
      signer
    );
    const _nft2Contract = new ethers.Contract(
      friendsAddress,
      friendsABI,
      signer
    );
    setContract(newContract);
    setProvider(newProvider);
    setNftContract(_nftContract);
    setNft2Contract(_nft2Contract);
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
      setWalletBalance(balanceInETH);
      const signer = await newProvider.getSigner();
      window.localStorage.setItem("connected", accounts[0]);
      const newContract = new ethers.Contract(marketAddress, marketABI, signer);
      const _nftContract = new ethers.Contract(
        boredStudentsAddress,
        boredStudentsABI,
        signer
      );
      const _nft2Contract = new ethers.Contract(
        friendsAddress,
        friendsABI,
        signer
      );
      setProvider(newProvider);
      setContract(newContract);
      setNftContract(_nftContract);
      setNft2Contract(_nft2Contract);
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
        connectWallet,
        isAdmin,
        provider,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
