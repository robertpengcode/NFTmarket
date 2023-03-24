import styles from "@/styles";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";

export default function SellNFT() {
  const { contract, walletAddress, collections } = useGlobalContext();
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [selectTabId, setSelectTabId] = useState("0");
  const [sellerBalance, setSellerBalance] = useState("0");

  //console.log("ck", sellerBalance);

  useEffect(() => {
    const getSellerBalance = async () => {
      if (contract) {
        const _sellerBalance = (
          await contract.getSellerProceed(walletAddress)
        ).toString();
        setSellerBalance(_sellerBalance);
      }
    };
    getSellerBalance();
  }, []);

  const collectionNamesArr = collections.map((collection) => collection.name);
  const collectionNameOptions = [
    "--choose a collection--",
    ...collectionNamesArr,
    "Others",
  ];
  const collectionAddrsArr = collections.map(
    (collection) => collection.address
  );

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

  //const sellerBalance = 2;

  const handleSubmitSell = async () => {
    console.log("submit sell!!");
    if (selectTabId === "0") {
      console.log("run list!");
    } else if (selectTabId === "1") {
      console.log("run update!");
    } else if (selectTabId === "2") {
      console.log("run cancel!");
    } else if (selectTabId === "3") {
      console.log("run withdraw!");
    }
    setTokenId("");
    setPrice("");
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
      case "3":
        return "Withdraw Proceed";
        break;
      default:
        return "List NFT";
    }
  };

  const buttonText = buttonTextFunc();

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
        <form
          className={styles.sellFormContainer}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitSell();
          }}
        >
          {selectTabId === "3" ? (
            <div className="flex flex-row my-2">
              <p className={styles.sellFormLabel}>
                Seller({showWalletAddress})'s Proceed Balance :{" "}
              </p>
              <p className={styles.sellFormLabel}>
                {sellerBalance ? sellerBalance : "0"}
              </p>
            </div>
          ) : (
            <>
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
                    Price:
                  </label>
                  <input
                    type="text"
                    name="sellPrice"
                    id="sellPrice"
                    placeholder=" input sell price"
                    className={styles.sellFormInput}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </>
              )}
            </>
          )}

          <button type="submit" className={styles.sellFormButton}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
