import { useState, useEffect } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import { useSubgraph } from "@/hooks/subgraph";
import { ethers } from "ethers";
import UserWithdraw from "@/components/UserWithdraw";
import Alert from "@/components/Alert";

export default function SellNFT() {
  const {
    contract,
    walletAddress,
    nftContract,
    nft2Contract,
    showAlert,
    setShowAlert,
    setUpdateUI,
  } = useGlobalContext();
  const { loading, error, data } = useSubgraph();
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [selectTabId, setSelectTabId] = useState("0");
  const [collectionNamesArr, setCollectionNamesArr] = useState([]);
  const [collectionAddrsArr, setCollectionAddrsArr] = useState([]);
  const [theNftContract, setTheNftContract] = useState(null);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };

  const collectionsArr = data ? data.createdCollections : null;

  // async function updateUI() {
  //   const _collectionNamesArr = [];
  //   const _collectionAddrsArr = [];
  //   for (let i = 0; i < collectionsArr.length; i++) {
  //     const response = await (
  //       await fetch(collectionsArr[i].collectionURI)
  //     ).json();
  //     _collectionNamesArr.push(response.name);
  //     _collectionAddrsArr.push(collectionsArr[i].nftContractAddr);
  //   }
  //   setCollectionNamesArr(_collectionNamesArr);
  //   setCollectionAddrsArr(_collectionAddrsArr);
  // }

  useEffect(() => {
    const updateUI = async () => {
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
    };
    if (collectionsArr) {
      updateUI();
    }
  }, [collectionsArr]);

  const collectionNameOptions = [
    "--choose a collection--",
    ...collectionNamesArr,
    "Others",
  ];

  const handleCollectionAddr = (name) => {
    if (collectionNamesArr.includes(name)) {
      const id = collectionNamesArr.indexOf(name);
      setCollectionAddr(collectionAddrsArr[id]);
      const _theNftContract = [nftContract, nft2Contract].find(
        (_nftContract) =>
          _nftContract.target.toLowerCase() === collectionAddrsArr[id]
      );
      setTheNftContract(_theNftContract);
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
    if (theNftContract) {
      try {
        const answer = await theNftContract.approve(contract.target, tokenId);
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        theNftContract.on("Approval", (owner, approved, tokenId) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Token (${tokenId}) is Approved to the market (${convertAddress(
              approved
            )}).`,
          });
        });
      } catch (error) {
        console.log(error);
        setShowAlert({
          status: true,
          type: "failure",
          message: `Something went wrong.`,
        });
      }
    }
  };

  const list = async () => {
    const priceInWei = ethers.parseEther(price);
    if (contract) {
      try {
        const answer = await contract.listNFT(
          collectionAddr,
          tokenId,
          priceInWei
        );
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("ListedNFT", (nftContractAddr, tokenId, seller) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Token (${tokenId}) is listed to the market (${convertAddress(
              nftContractAddr
            )}) for sale by the seller (${convertAddress(seller)}).`,
          });
          setUpdateUI((pre) => !pre);
        });
      } catch (error) {
        console.log(error);
        setShowAlert({
          status: true,
          type: "failure",
          message: `Something went wrong.`,
        });
      }
    }
  };

  const updateList = async () => {
    const priceInWei = ethers.parseEther(price);
    if (contract) {
      try {
        const answer = await contract.updateListingPrice(
          collectionAddr,
          tokenId,
          priceInWei
        );
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on(
          "UpdatedListingPrice",
          (nftContractAddr, tokenId, newPrice) => {
            setShowAlert({
              status: true,
              type: "success",
              message: `Token (${tokenId})'s price is updated to ${ethers.formatEther(
                newPrice
              )} Matic.`,
            });
            setUpdateUI((pre) => !pre);
          }
        );
      } catch (error) {
        console.log(error);
        setShowAlert({
          status: true,
          type: "failure",
          message: `Something went wrong.`,
        });
      }
    }
  };

  const cancelList = async () => {
    if (contract) {
      try {
        const answer = await contract.deleteListing(collectionAddr, tokenId);
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("DeletedListing", (nftContractAddr, tokenId) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Token (${tokenId}) is removed from the list.`,
          });
          setUpdateUI((pre) => !pre);
        });
      } catch (error) {
        console.log(error);
        setShowAlert({
          status: true,
          type: "failure",
          message: `Something went wrong.`,
        });
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
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
