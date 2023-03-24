import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
//import Button from "react-bootstrap/Button";
//import Form from "react-bootstrap/Form";
//import Container from "react-bootstrap/Container";

export default function Admin() {
  const { contract, walletAddress, isAdmin } = useGlobalContext();
  const [selectTabId, setSelectTabId] = useState("0");
  const [collectionName, setCollectionName] = useState("");
  const [collectionAddr, setCollectionAddr] = useState("");
  const [collectionURL, setCollectionURL] = useState("");
  const [collectionDes, setCollectionDes] = useState("");
  const [collectionSupply, setCollectionSupply] = useState("");
  const [collectionTeam, setCollectionTeam] = useState("");
  const [ownerBalance, setOwnerBalance] = useState("0");

  useEffect(() => {
    const getOwnerBalance = async () => {
      if (contract) {
        const _ownerBalance = (await contract.getContractBalance()).toString();
        setOwnerBalance(_ownerBalance);
      }
    };
    getOwnerBalance();
  }, []);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  const handleTab = (e) => {
    setSelectTabId(e.target.id);
  };

  const buttonTextFunc = () => {
    switch (selectTabId) {
      case "1":
        return "Withdraw Balance";
        break;
      default:
        return "Create Collection";
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

  const handleSubmitCollection = async () => {
    console.log("submit!!");
    setCollectionName("");
    setCollectionAddr("");
    setCollectionURL("");
    setCollectionDes("");
    setCollectionSupply("");
    setCollectionTeam("");
    // handleBattlePlayer();
    // try {
    //   await contract.pickCharacter(charOption);
    //   if (useBerserk) {
    //     await contract.useBerserk();
    //   }
    //   if (useForceShield) {
    //     await contract.useForceShield();
    //   }
    //   setShowAlert({
    //     status: true,
    //     type: 'info',
    //     message: `Character & treasures submitted!`,
    //   });
    //   setCharOption(0);
    //   setUseBerserk(false);
    //   setUseForceShield(false);
    //   const timer = setTimeout(()=>{setUpdateEvent(!updateEvent);},[4000]);
    //   return () => clearTimeout(timer);
    // } catch(error) {
    //   console.log(error);
    //   setErrorMessage(error);
    // }
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
            Create Collection
          </div>
          <div
            className={
              selectTabId !== "1" ? `${styles.sellTab}` : `${styles.sellTabOn}`
            }
            id="1"
          >
            Withdraw Balance
          </div>
        </div>

        <form
          className={styles.sellFormContainer}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitCollection();
          }}
        >
          {selectTabId === "1" ? (
            <div className="flex flex-row my-2">
              <p className={styles.sellFormLabel}>
                Owner({showWalletAddress})'s Balance in Contract:{" "}
              </p>
              <p className={styles.sellFormLabel}>
                {ownerBalance ? ownerBalance : "0"}
              </p>
            </div>
          ) : (
            <>
              {" "}
              <label htmlFor="name" className={styles.sellFormLabel}>
                Collection Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="input collection name"
                className={styles.sellFormInput}
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
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
              <label htmlFor="imageURL" className={styles.sellFormLabel}>
                Image URL:
              </label>
              <input
                type="text"
                name="imageURL"
                id="imageURL"
                placeholder="input collection image URL"
                className={styles.sellFormInput}
                value={collectionURL}
                onChange={(e) => setCollectionURL(e.target.value)}
              />
              <label htmlFor="description" className={styles.sellFormLabel}>
                Description:
              </label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="input collection description"
                className={styles.sellFormInput}
                value={collectionDes}
                onChange={(e) => setCollectionDes(e.target.value)}
              />
              <label htmlFor="rollNumber" className={styles.sellFormLabel}>
                Supply:
              </label>
              <input
                type="text"
                name="rollNumber"
                id="rollNumber"
                placeholder="input collection total supply"
                className={styles.sellFormInput}
                value={collectionSupply}
                onChange={(e) => setCollectionSupply(e.target.value)}
              />
              <label htmlFor="rollNumber" className={styles.sellFormLabel}>
                Team:
              </label>
              <input
                type="text"
                name="rollNumber"
                id="rollNumber"
                placeholder="input project team name"
                className={styles.sellFormInput}
                value={collectionTeam}
                onChange={(e) => setCollectionTeam(e.target.value)}
              />
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
