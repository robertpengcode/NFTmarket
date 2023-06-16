import { useState } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import OwnerWithdraw from "../components/OwnerWithdraw";
import Alert from "@/components/Alert";

export default function Admin() {
  const {
    contract,
    isAdmin,
    showAlert,
    setShowAlert,
    setUpdateUI,
    convertAddress,
    signer,
  } = useGlobalContext();
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
  const [attributeKey1, setAttributeKey1] = useState("");
  const [attributeKey2, setAttributeKey2] = useState("");
  const [attributeKey3, setAttributeKey3] = useState("");
  const [attributeKey4, setAttributeKey4] = useState("");
  const [attributeKey5, setAttributeKey5] = useState("");
  const [attributeKey6, setAttributeKey6] = useState("");
  const [attributeValue1, setAttributeValue1] = useState("");
  const [attributeValue2, setAttributeValue2] = useState("");
  const [attributeValue3, setAttributeValue3] = useState("");
  const [attributeValue4, setAttributeValue4] = useState("");
  const [attributeValue5, setAttributeValue5] = useState("");
  const [attributeValue6, setAttributeValue6] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [team, setTeam] = useState("");
  const [collectionJason, setCollectionJason] = useState("");

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

  const handleSubmitCollection = () => {
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
    setAttributeKey1("");
    setAttributeValue1("");
    setAttributeKey2("");
    setAttributeValue2("");
    setAttributeKey3("");
    setAttributeValue3("");
    setAttributeKey4("");
    setAttributeValue4("");
    setAttributeKey5("");
    setAttributeValue5("");
    setAttributeKey6("");
    setAttributeValue6("");
    setMaxSupply("");
    setTeam("");
    setCollectionURL("");
  };

  const inputInfo = () => {
    const _collectionJason = makeURI();
    setCollectionJason(_collectionJason);
  };

  const createCollection = async () => {
    if (contract) {
      try {
        const answer = await contract
          .connect(signer)
          .createCollection(
            collectionAddr,
            royaltyAddr,
            royaltyPercent,
            collectionURL
          );
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("CreatedCollection", (nftContractAddr) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Collection (${convertAddress(
              nftContractAddr
            )}) is created.`,
          });
          //setUpdateUI((pre) => !pre);
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

  const updateCollection = async () => {
    if (contract) {
      try {
        const answer = await contract
          .connect(signer)
          .updateCollection(
            collectionAddr,
            royaltyAddr,
            royaltyPercent,
            collectionURL
          );
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("UpdatedCollection", (nftContractAddr) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Collection (${convertAddress(
              nftContractAddr
            )}) is updated.`,
          });
          //setUpdateUI((pre) => !pre);
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

  const deleteCollection = async () => {
    if (contract) {
      try {
        const answer = await contract
          .connect(signer)
          .deleteCollection(collectionAddr);
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("DeletedCollection", (nftContractAddr) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Collection (${convertAddress(
              nftContractAddr
            )}) is delected.`,
          });
          //setUpdateUI((pre) => !pre);
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
    obj.attributes = {};

    if (attributeKey1) {
      obj.attributes[attributeKey1] = attributeValue1.split(",");
    }
    if (attributeKey2) {
      obj.attributes[attributeKey2] = attributeValue2.split(",");
    }
    if (attributeKey3) {
      obj.attributes[attributeKey3] = attributeValue3.split(",");
    }
    if (attributeKey4) {
      obj.attributes[attributeKey4] = attributeValue4.split(",");
    }
    if (attributeKey5) {
      obj.attributes[attributeKey5] = attributeValue5.split(",");
    }
    if (attributeKey6) {
      obj.attributes[attributeKey6] = attributeValue6.split(",");
    }

    obj.maxSupply = maxSupply;
    obj.team = team;
    return JSON.stringify(obj);
  };

  return !isAdmin ? null : (
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

                <div className={styles.sellFormLabel}> Attributes:</div>
                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key1" className={styles.sellFormLabelAttKey}>
                    Key 1:
                  </label>
                  <input
                    type="text"
                    name="key1"
                    id="key1"
                    placeholder=" input attribute 1"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey1}
                    onChange={(e) => setAttributeKey1(e.target.value)}
                  />
                  <label
                    htmlFor="value1"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 1:
                  </label>
                  <input
                    type="text"
                    name="value1"
                    id="value1"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 1"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue1}
                    onChange={(e) => setAttributeValue1(e.target.value)}
                  />
                </div>

                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key2" className={styles.sellFormLabelAttKey}>
                    Key 2:
                  </label>
                  <input
                    type="text"
                    name="key2"
                    id="key2"
                    placeholder=" input attribute 2"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey2}
                    onChange={(e) => setAttributeKey2(e.target.value)}
                  />
                  <label
                    htmlFor="value2"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 2:
                  </label>
                  <input
                    type="text"
                    name="value2"
                    id="value2"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 2"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue2}
                    onChange={(e) => setAttributeValue2(e.target.value)}
                  />
                </div>

                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key3" className={styles.sellFormLabelAttKey}>
                    Key 3:
                  </label>
                  <input
                    type="text"
                    name="key3"
                    id="key3"
                    placeholder=" input attribute 3"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey3}
                    onChange={(e) => setAttributeKey3(e.target.value)}
                  />
                  <label
                    htmlFor="value3"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 3:
                  </label>
                  <input
                    type="text"
                    name="value3"
                    id="value3"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 3"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue3}
                    onChange={(e) => setAttributeValue3(e.target.value)}
                  />
                </div>

                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key4" className={styles.sellFormLabelAttKey}>
                    Key 4:
                  </label>
                  <input
                    type="text"
                    name="key4"
                    id="key4"
                    placeholder=" input attribute 4"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey4}
                    onChange={(e) => setAttributeKey4(e.target.value)}
                  />
                  <label
                    htmlFor="value4"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 4:
                  </label>
                  <input
                    type="text"
                    name="value4"
                    id="value4"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 4"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue4}
                    onChange={(e) => setAttributeValue4(e.target.value)}
                  />
                </div>

                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key5" className={styles.sellFormLabelAttKey}>
                    Key 5:
                  </label>
                  <input
                    type="text"
                    name="key5"
                    id="key5"
                    placeholder=" input attribute 5"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey5}
                    onChange={(e) => setAttributeKey5(e.target.value)}
                  />
                  <label
                    htmlFor="value5"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 5:
                  </label>
                  <input
                    type="text"
                    name="value5"
                    id="value5"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 5"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue5}
                    onChange={(e) => setAttributeValue5(e.target.value)}
                  />
                </div>

                <div className={styles.sellFormAttBox}>
                  <label htmlFor="key6" className={styles.sellFormLabelAttKey}>
                    Key 6:
                  </label>
                  <input
                    type="text"
                    name="key6"
                    id="key6"
                    placeholder=" input attribute 6"
                    className={styles.sellFormInputAttKey}
                    value={attributeKey6}
                    onChange={(e) => setAttributeKey6(e.target.value)}
                  />
                  <label
                    htmlFor="value6"
                    className={styles.sellFormLabelAttValue}
                  >
                    Value 6:
                  </label>
                  <input
                    type="text"
                    name="value6"
                    id="value6"
                    placeholder=" input elements (i.e. element1,element2,element3) for attribute 6"
                    className={styles.sellFormInputAttValue}
                    value={attributeValue6}
                    onChange={(e) => setAttributeValue6(e.target.value)}
                  />
                </div>

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
