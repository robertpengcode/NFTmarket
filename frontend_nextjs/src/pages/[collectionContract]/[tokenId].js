import { useState, useEffect } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../../context";
import { useSubgraph } from "@/hooks/subgraph";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Image from "next/image";
import Alert from "@/components/Alert";
import Chart from "@/components/PriceChart";

export default function Nft() {
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
  const router = useRouter();
  const { collectionContract, tokenId } = router.query;
  const [attributesCount, setAttributesCount] = useState(null);
  const [theNftContract, setTheNftContract] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nftImgURL, setNftImgURL] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [team, setTeam] = useState("");
  const [marketFeePercent, setMarketFeePercent] = useState("");

  const collection = data
    ? data.createdCollections.find(
        (collection) => collection.nftContractAddr === collectionContract
      )
    : null;

  const { collectionURI, nftContractAddr, royaltyPercent } = collection
    ? collection
    : "";

  const listing = data
    ? data.listedNFTs.find(
        (listing) =>
          listing.nftContractAddr === collectionContract &&
          listing.tokenId === tokenId
      )
    : null;

  const { price, seller } = listing ? listing : "";

  const listingsArr = data
    ? data.listedNFTs.filter(
        (listing) => listing.nftContractAddr === collectionContract
      )
    : null;

  const transactionsArr = data
    ? data.boughtNFTs.filter(
        (transaction) =>
          transaction.nftContractAddr === collectionContract &&
          transaction.tokenId === tokenId
      )
    : null;

  useEffect(() => {
    const calculateRarity = async (listings) => {
      const _theNftContract = [nftContract, nft2Contract].find(
        (_nftContract) =>
          _nftContract.target.toLowerCase() === collectionContract
      );
      const result = {};
      for (let i = 0; i < listings.length; i++) {
        const nftURI = await _theNftContract.tokenURI(
          listings[i].tokenId.toString()
        );
        const { attributes } = await (await fetch(nftURI)).json();
        for (let j = 0; j < attributes.length; j++) {
          const { trait_type, value } = attributes[j];
          if (trait_type in result) {
            if (value in result[trait_type]) {
              result[trait_type][value] += 1;
            } else {
              result[trait_type][value] = 1;
            }
          } else {
            result[trait_type] = { [value]: 1 };
          }
        }
      }
      setAttributesCount(result);
    };
    if (listingsArr) {
      calculateRarity(listingsArr);
    }
  }, [collectionContract, listingsArr, nft2Contract, nftContract]);

  useEffect(() => {
    const getNftUri = async () => {
      const _theNftContract = [nftContract, nft2Contract].find(
        (_nftContract) =>
          _nftContract.target.toLowerCase() === collectionContract
      );
      setTheNftContract(_theNftContract);

      const nftURI = await _theNftContract.tokenURI(tokenId.toString());
      const response = await (await fetch(nftURI)).json();
      setName(response.name);
      setDescription(response.description);
      setNftImgURL(response.image);
      setAttributes(response.attributes);

      if (collectionURI) {
        const response = await (await fetch(collectionURI)).json();
        setCollectionName(response.name);
        setTeam(response.team);
      }

      if (contract) {
        const _marketFeePercent = await contract.marketFeePercent();
        setMarketFeePercent(_marketFeePercent.toString());
      }
    };

    if (nftContract && nft2Contract && tokenId) {
      getNftUri();
    }
  }, [
    collectionContract,
    collectionURI,
    contract,
    nft2Contract,
    nftContract,
    tokenId,
  ]);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };

  const showSeller = !seller
    ? ""
    : seller === walletAddress
    ? "You"
    : convertAddress(seller);

  const totalPrice = price
    ? (
        (price * (100 + Number(marketFeePercent) + Number(royaltyPercent))) /
        100
      ).toString()
    : "";

  const showPrice = totalPrice ? ethers.formatEther(totalPrice) : "";

  const handleBuy = async () => {
    if (contract) {
      try {
        const answer = await contract.buyNFT(nftContractAddr, tokenId, {
          value: totalPrice,
        });
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("BoughtNFT", (nftContractAddr, tokenId, buyer) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Token (${tokenId}) is bought by (${convertAddress(
              buyer
            )}).`,
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
      <div className={styles.nftContainer}>
        <div className={styles.nftInfoLeft}>
          <div className={styles.nftInfoLeftItem}>{collectionName}</div>
          <div className={styles.nftInfoLeftItem}>Token ID: {tokenId}</div>
          <div className={styles.nftInfoLeftItem}>Created by: {team}</div>
          <div className={styles.nftImageContainer}>
            {!nftImgURL ? null : (
              <Image
                src={nftImgURL}
                alt="nft image"
                className={styles.nftImage}
                width="500"
                height="500"
              />
            )}
          </div>
          <div className={styles.nftInfoLeftItem}>Price: {showPrice} MATIC</div>
          <div className={styles.nftInfoLeftItem}>Sell By: {showSeller}</div>
          <button
            className={styles.nftBTN}
            disabled={seller === walletAddress}
            onClick={handleBuy}
          >
            Buy Now
          </button>
        </div>
        <div className={styles.nftInfoRight}>
          <div className="flex flex-row">
            <div className={styles.nftInfoRightItem}>
              <p className={styles.nftInfoRightItemText}>Name</p>
              <div className={styles.nftDescriptionContainer}>{name}</div>
            </div>
            <div className={styles.nftInfoRightItem}>
              <p className={styles.nftInfoRightItemText}>Description</p>
              <div className={styles.nftDescriptionContainer}>
                {description}
              </div>
            </div>
          </div>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>
              Attributes {`(${attributes.length})`}
            </p>
            <div className={styles.nftAttributesContainer}>
              {attributes.map((attribute, id) => (
                <div className={styles.nftAttributeBox} key={id}>
                  <div className={styles.nftAttributeKey}>
                    {attribute.trait_type}
                  </div>
                  <div className={styles.nftAttributeValue}>
                    {attribute.value}
                  </div>
                  <div className={styles.nftAttributeRare}>
                    {!attributesCount ? (
                      <span>0</span>
                    ) : (
                      <span>
                        {Math.round(
                          (attributesCount[attribute.trait_type][
                            attribute.value
                          ] *
                            100) /
                            listingsArr.length
                        )}
                      </span>
                    )}
                    <span>% have this trait</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>Price History</p>
            <div className={styles.nftChartContainer}>
              <Chart transactions={transactionsArr} tokenId={tokenId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
