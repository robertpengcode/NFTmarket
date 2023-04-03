import { ethers } from "ethers";
import styles from "@/styles";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import UserWithdraw from "@/components/UserWithdraw";

export default function SellNFT() {
  const { contract, walletAddress, collections } = useGlobalContext();
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [selectTabId, setSelectTabId] = useState("0");

  console.log("what?", collections);

  const collectionNamesArr = collections
    ? collections.map((collection) => collection.name)
    : [];

  const collectionNameOptions = [
    "--choose a collection--",
    ...collectionNamesArr,
    "Others",
  ];
  const collectionAddrsArr = collections
    ? collections.map((collection) => collection.address)
    : [];

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  const handleCollectionAddr = (name) => {
    if (collectionNamesArr.includes(name)) {
      const id = collectionNamesArr.indexOf(name);
      setCollectionAddr(collectionAddrsArr[id]);
    } else {
      setCollectionAddr("");
    }
  };

  const handleTab = (e) => {
    setSelectTabId(e.target.id);
  };

  const buttonTextFunc = () => {
    switch (selectTabId) {
      case "1":
        return "Update Price";
        break;
      case "2":
        return "Cancel Listing";
        break;
      default:
        return "List NFT";
    }
  };

  const buttonText = buttonTextFunc();

  const handleSubmitSell = () => {
    console.log("submit sell!!");
    if (selectTabId === "0") {
      approveAndList();
    } else if (selectTabId === "1") {
      updateList();
    } else if (selectTabId === "2") {
      cancelList();
    }
    setCollectionName("");
    setCollectionAddr("");
    setTokenId("");
    setPrice("");
  };

  //nft contract 0xE3fca70EF8B81112E2386ECb490De51BF459c299
  const approveAndList = async () => {
    console.log("create list!");
    const priceInWei = ethers.parseEther(price);
    if (contract) {
      try {
        await contract.listNFT(collectionAddr, tokenId, priceInWei);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateList = async () => {
    console.log("update list!");
    const priceInWei = ethers.parseEther(price);
    if (contract) {
      try {
        await contract.updateListingPrice(collectionAddr, tokenId, priceInWei);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const cancelList = async () => {
    console.log("cancel list!");
    if (contract) {
      try {
        await contract.deleteListing(collectionAddr, tokenId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sellContainer}>
        <div className={styles.sellTabsBox} onClick={(e) => handleTab(e)}>
          <div
            className={
              selectTabId !== "0" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            value={selectTabId}
            id="0"
          >
            List NFT
          </div>
          <div
            className={
              selectTabId !== "1" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="1"
          >
            Update Price
          </div>
          <div
            className={
              selectTabId !== "2" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="2"
          >
            Cancel Listing
          </div>
          <div
            className={
              selectTabId !== "3" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="3"
          >
            Withdraw Proceed
          </div>
        </div>

        {selectTabId === "3" ? (
          <UserWithdraw />
        ) : (
          <form
            className={styles.sellFormContainer}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitSell();
            }}
          >
            <label htmlFor="collectionName" className={styles.sellFormLabel}>
              Choose a Collection:
            </label>
            <select
              name="collectionName"
              id="collectionName"
              value={collectionName}
              className={styles.sellFormInput}
              onChange={(e) => {
                setCollectionName(e.target.value);
                handleCollectionAddr(e.target.value);
              }}
            >
              {collectionNameOptions.map((option, id) => (
                <option key={id} value={option} className="">
                  {option}
                </option>
              ))}
            </select>
            <label htmlFor="contractAddr" className={styles.sellFormLabel}>
              Collection Contract Address:
            </label>
            <input
              type="text"
              name="contractAddr"
              id="contractAddr"
              placeholder="input collection contract address"
              className={styles.sellFormInput}
              value={collectionAddr}
              onChange={(e) => setCollectionAddr(e.target.value)}
            />
            <label htmlFor="tokenId" className={styles.sellFormLabel}>
              NFT Token ID:
            </label>
            <input
              type="text"
              name="tokenId"
              id="tokenId"
              placeholder=" input NFT token id"
              className={styles.sellFormInput}
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            {selectTabId !== "2" && (
              <>
                <label htmlFor="sellPrice" className={styles.sellFormLabel}>
                  Price in Matic:
                </label>
                <input
                  type="text"
                  name="sellPrice"
                  id="sellPrice"
                  placeholder=" input sell price in Matic"
                  className={styles.sellFormInput}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </>
            )}

            <button type="submit" className={styles.sellFormButton}>
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}