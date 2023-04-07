import styles from "@/styles";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import { useRouter } from "next/router";
import { useSubgraph } from "@/hooks/subgraph";
import { ethers } from "ethers";

export default function Nft() {
  const { contract, walletAddress, nftContract } = useGlobalContext();
  const router = useRouter();
  const { collectionContract, tokenId } = router.query;

  const { loading, error, data } = useSubgraph();

  const [attributesCount, setAttributesCount] = useState(null);

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

  useEffect(() => {
    const calculateRarity = async (listings) => {
      const result = {};
      for (let i = 0; i < listings.length; i++) {
        const nftURI = await nftContract.tokenURI(
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
  }, []);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showSeller = seller ? convertAddress(seller) : "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nftImgURL, setNftImgURL] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [team, setTeam] = useState("");
  const [marketFeePercent, setMarketFeePercent] = useState("");

  useEffect(() => {
    const getNftUri = async () => {
      const nftURI = await nftContract.tokenURI(tokenId.toString());
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

    if (nftContract && tokenId) {
      getNftUri();
    }
  }, []);

  const totalPrice = price
    ? (
        (price * (100 + Number(marketFeePercent) + Number(royaltyPercent))) /
        100
      ).toString()
    : "";

  const showPrice = totalPrice ? ethers.formatEther(totalPrice) : "";

  const handleBuy = async () => {
    console.log("buy buy");
    console.log("t", totalPrice);
    if (contract) {
      try {
        await contract.buyNFT(nftContractAddr, tokenId, { value: totalPrice });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
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
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>Name</p>
            <div className={styles.nftDescriptionContainer}>{name}</div>
          </div>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>Description</p>
            <div className={styles.nftDescriptionContainer}>{description}</div>
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
        </div>
      </div>
    </div>
  );
}
