import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import OwnerWithdraw from "../components/OwnerWithdraw";
//import { storeMetadata } from "../../utils/uploadToPinata";

export default function Admin() {
  const { contract, walletAddress, isAdmin } = useGlobalContext();
  const [selectTabId, setSelectTabId] = useState("0");
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [royaltyAddr, setRoyaltyAddr] = useState("");
  const [royaltyPercent, setRoyaltyPercent] = useState("");
  const [collectionURL, setCollectionURL] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [iconURL, setIconURL] = useState("");
  const [bannerURL, setBannerURL] = useState("");
  const [collectionDes, setCollectionDes] = useState("");
  const [attributes, setAttributes] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [team, setTeam] = useState("");
  const [collectionJason, setCollectionJason] = useState("");

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  //const handleSubmitSell = async () => {};

  const handleTab = (e) => {
    setSelectTabId(e.target.id);
  };

  const buttonTextFunc = () => {
    switch (selectTabId) {
      case "1":
        return "Create Collection";
        break;
      case "2":
        return "Update Collection";
        break;
      case "3":
        return "Cancel Collection";
        break;
      default:
        return "Get Jason";
    }
  };

  const buttonText = buttonTextFunc();

  //   const listCharity = async () => {
  //     if (!contract) {
  //       alert("Please connect to MetaMask!");
  //       return;
  //     }
  //     await contract
  //       .listCharity(charityURI, charityAddr, minFundUSD)
  //       .then(() => alert("list charity success!"))
  //       .catch((err) => {
  //         alert(err.message);
  //       });
  //     setCharityAddr("");
  //     setCharityURI("");
  //     setMinFundUSD("");
  //   };

  //   const deleteCharity = async (charityId) => {
  //     if (!contract) {
  //       alert("Please connect to MetaMask!");
  //       return;
  //     }
  //     await contract
  //       .deleteCharity(charityId)
  //       .then(() => alert("delete charity success!"))
  //       .catch((err) => {
  //         alert(err.message);
  //       });
  //   };

  const handleSubmitCollection = () => {
    //console.log("submit collection!!");
    if (selectTabId === "0") {
      inputInfo();
    } else if (selectTabId === "1") {
      createCollection();
    } else if (selectTabId === "2") {
      updateCollection();
    } else if (selectTabId === "3") {
      deleteCollection();
    }

    setCollectionName("");
    setCollectionAddr("");
    setRoyaltyAddr("");
    setRoyaltyPercent("");
    setWebsiteURL("");
    setIconURL("");
    setBannerURL("");
    setCollectionDes("");
    setAttributes("");
    setMaxSupply("");
    setTeam("");
    setCollectionURL("");
  };

  // const collectionURI =
  //   "https://gateway.pinata.cloud/ipfs/QmacRZYzXQ1h5SxAjAawnWxqHa295AYNvkMeRhWc1xCNcU?_gl=1*1i2zej6*_ga*YTUwMDhhNzgtYTBiYS00MGU1LWEzYWYtYTk3YzkwMWI0YzFj*_ga_5RMPXG14TE*MTY4MDExNzE2Ni4yMy4wLjE2ODAxMTcxNjcuNTkuMC4w";
  const inputInfo = () => {
    //console.log("input!!");
    const _collectionJason = makeURI();
    //console.log("ck", _collectionJason);
    setCollectionJason(_collectionJason);
  };

  const createCollection = async () => {
    //console.log("create col!!");
    //const collectionURI = makeURI();
    if (contract) {
      try {
        await contract.createCollection(
          collectionAddr,
          royaltyAddr,
          royaltyPercent,
          collectionURL
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateCollection = async () => {
    //console.log("update col!!");
    //const collectionURI = makeURI();
    if (contract) {
      try {
        await contract.updateCollection(
          collectionAddr,
          royaltyAddr,
          royaltyPercent,
          collectionURL
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteCollection = async () => {
    //console.log("delete col!!");
    if (contract) {
      try {
        await contract.deleteCollection(collectionAddr);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const makeURI = () => {
    const obj = {};
    obj.name = collectionName;
    obj.address = collectionAddr;
    obj.royaltyAddr = royaltyAddr;
    obj.royaltyPercent = royaltyPercent;
    obj.websiteURL = websiteURL;
    obj.iconURL = iconURL;
    obj.bannerURL = bannerURL;
    obj.description = collectionDes;
    obj.attributes = attributes.split(",");
    obj.maxSupply = maxSupply;
    obj.team = team;
    //console.log("obj", JSON.stringify(obj));
    return JSON.stringify(obj);
  };

  return !isAdmin ? null : (
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
            Input Collection Info
          </div>
          <div
            className={
              selectTabId !== "1" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            value={selectTabId}
            id="1"
          >
            Create Collection
          </div>
          <div
            className={
              selectTabId !== "2" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="2"
          >
            Update Collection
          </div>
          <div
            className={
              selectTabId !== "3" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="3"
          >
            Cancel Collection
          </div>
          <div
            className={
              selectTabId !== "4" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="4"
          >
            Withdraw Balance
          </div>
        </div>

        {selectTabId === "4" ? (
          <OwnerWithdraw />
        ) : (
          <form
            className={styles.sellFormContainer}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitCollection();
            }}
          >
            <label htmlFor="contractAddr" className={styles.sellFormLabel}>
              Collection (NFT) Contract Address:
            </label>
            <input
              type="text"
              name="contractAddr"
              id="contractAddr"
              placeholder=" input collection (NFT) contract address"
              className={styles.sellFormInput}
              value={collectionAddr}
              onChange={(e) => setCollectionAddr(e.target.value)}
            />

            {selectTabId === "3" ? null : (
              <>
                <label htmlFor="royaltyAddr" className={styles.sellFormLabel}>
                  Collection Royalties Payment Address:
                </label>
                <input
                  type="text"
                  name="royaltyAddr"
                  id="royaltyAddr"
                  placeholder=" input collection royalties payment address"
                  className={styles.sellFormInput}
                  value={royaltyAddr}
                  onChange={(e) => setRoyaltyAddr(e.target.value)}
                />
                <label
                  htmlFor="royaltyPercent"
                  className={styles.sellFormLabel}
                >
                  Collection Royalties Percentage:
                </label>
                <input
                  type="text"
                  name="royaltyPercent"
                  id="royaltyPercent"
                  placeholder=" input collection royalties percentage"
                  className={styles.sellFormInput}
                  value={royaltyPercent}
                  onChange={(e) => setRoyaltyPercent(e.target.value)}
                />
              </>
            )}

            {selectTabId === "0" || selectTabId === "3" ? null : (
              <>
                <label htmlFor="collectionURL" className={styles.sellFormLabel}>
                  Collection Metadata URL:
                </label>
                <input
                  type="url"
                  name="collectionURL"
                  id="collectionURL"
                  placeholder=" input collection metadata URL"
                  className={styles.sellFormInput}
                  value={collectionURL}
                  onChange={(e) => setCollectionURL(e.target.value)}
                />
              </>
            )}

            {selectTabId !== "0" ? null : (
              <>
                <label htmlFor="name" className={styles.sellFormLabel}>
                  Collection Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=" input collection name"
                  className={styles.sellFormInput}
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
                <label htmlFor="websiteURL" className={styles.sellFormLabel}>
                  Website URL:
                </label>
                <input
                  type="url"
                  name="websiteURL"
                  id="websiteURL"
                  placeholder=" input collection website URL"
                  className={styles.sellFormInput}
                  value={websiteURL}
                  onChange={(e) => setWebsiteURL(e.target.value)}
                />
                <label htmlFor="imageURL" className={styles.sellFormLabel}>
                  Icon URL:
                </label>
                <input
                  type="url"
                  name="iconURL"
                  id="iconURL"
                  placeholder=" input collection icon URL"
                  className={styles.sellFormInput}
                  value={iconURL}
                  onChange={(e) => setIconURL(e.target.value)}
                />
                <label htmlFor="imageURL" className={styles.sellFormLabel}>
                  Banner URL:
                </label>
                <input
                  type="url"
                  name="bannerURL"
                  id="bannerURL"
                  placeholder=" input collection banner URL"
                  className={styles.sellFormInput}
                  value={bannerURL}
                  onChange={(e) => setBannerURL(e.target.value)}
                />
                <label
                  htmlFor="description"
                  className={`${styles.sellFormLabel}`}
                >
                  Description:
                </label>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  placeholder=" input collection description"
                  className={`${styles.sellFormInput} h-[100px]`}
                  value={collectionDes}
                  onChange={(e) => setCollectionDes(e.target.value)}
                />
                <label htmlFor="maxSupply" className={styles.sellFormLabel}>
                  Attributes:
                </label>
                <input
                  type="text"
                  name="attributes"
                  id="attributes"
                  placeholder=" input attributes (i.e. attribute1,attribute2,attribute3)"
                  className={styles.sellFormInput}
                  value={attributes}
                  onChange={(e) => setAttributes(e.target.value)}
                />
                <label htmlFor="maxSupply" className={styles.sellFormLabel}>
                  Max Supply:
                </label>
                <input
                  type="text"
                  name="maxSupply"
                  id="maxSupply"
                  placeholder=" input collection max supply"
                  className={styles.sellFormInput}
                  value={maxSupply}
                  onChange={(e) => setMaxSupply(e.target.value)}
                />
                <label htmlFor="team" className={styles.sellFormLabel}>
                  Team:
                </label>
                <input
                  type="text"
                  name="team"
                  id="team"
                  placeholder=" input project team name"
                  className={styles.sellFormInput}
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
                <div className={styles.sellFormLabel}>Json:</div>
                {!collectionJason ? null : (
                  <div className={styles.sellFormInput}>
                    <p className="break-words">{collectionJason}</p>
                  </div>
                )}
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
