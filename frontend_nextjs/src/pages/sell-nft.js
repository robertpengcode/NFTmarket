import { ethers } from "ethers";
import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { useSubgraph } from "@/hooks/subgraph";
import UserWithdraw from "@/components/UserWithdraw";

export default function SellNFT() {
  const { loading, error, data } = useSubgraph();
  const collectionsArr = data ? data.createdCollections : null;
  const { contract, walletAddress, nftContract } = useGlobalContext();
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [selectTabId, setSelectTabId] = useState("0");
  const [collectionNamesArr, setCollectionNamesArr] = useState([]);
  const [collectionAddrsArr, setCollectionAddrsArr] = useState([]);

  async function updateUI() {
    const _collectionNamesArr = [];
    const _collectionAddrsArr = [];
    for (let i = 0; i < collectionsArr.length; i++) {
      const response = await (
        await fetch(collectionsArr[i].collectionURI)
      ).json();
      _collectionNamesArr.push(response.name);
      _collectionAddrsArr.push(collectionsArr[i].nftContractAddr);
    }
    setCollectionNamesArr(_collectionNamesArr);
    setCollectionAddrsArr(_collectionAddrsArr);
  }

  useEffect(() => {
    if (collectionsArr) {
      updateUI();
    }
  }, []);

  const collectionNameOptions = [
    "--choose a collection--",
    ...collectionNamesArr,
    "Others",
  ];

  const handleCollectionAddr = (name) => {
    if (collectionNamesArr.includes(name)) {
      const id = collectionNamesArr.indexOf(name);
      setCollectionAddr(collectionAddrsArr[id]);
    } else {
      setCollectionAddr("xxxx");
    }
  };

  const handleTab = (e) => {
    setSelectTabId(e.target.id);
  };

  const buttonTextFunc = () => {
    switch (selectTabId) {
      case "1":
        return "List NFT";
        break;
      case "2":
        return "Update Price";
        break;
      case "3":
        return "Cancel Listing";
        break;
      default:
        return "Approve NFT";
    }
  };

  const buttonText = buttonTextFunc();

  const handleSubmitSell = () => {
    if (selectTabId === "0") {
      approve();
    } else if (selectTabId === "1") {
      list();
    } else if (selectTabId === "2") {
      updateList();
    } else if (selectTabId === "3") {
      cancelList();
    }
    setCollectionName("");
    setCollectionAddr("");
    setTokenId("");
    setPrice("");
  };

  const approve = async () => {
    if (nftContract) {
      try {
        await nftContract.approve(contract.target, tokenId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const list = async () => {
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
            Approve NFT
          </div>
          <div
            className={
              selectTabId !== "1" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            value={selectTabId}
            id="1"
          >
            List NFT
          </div>
          <div
            className={
              selectTabId !== "2" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="2"
          >
            Update Price
          </div>
          <div
            className={
              selectTabId !== "3" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="3"
          >
            Cancel Listing
          </div>
          <div
            className={
              selectTabId !== "4" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="4"
          >
            Withdraw Proceed
          </div>
        </div>

        {selectTabId === "4" ? (
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
            {selectTabId !== "0" && selectTabId !== "3" && (
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
