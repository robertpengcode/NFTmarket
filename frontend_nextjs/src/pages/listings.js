import url from "../assets/Karen.png";
import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";

import AttributeBox from "@/components/AttributeBox";
import { collections } from "@/devData";
import { useSubgraph } from "@/hooks/subgraph";
import Listing from "@/components/Listing";
import { boredStudentsABI, boredStudentsAddress } from "../contract";
import { ethers } from "ethers";

// const listingsArr = [
//   {
//     url: url1,
//     collection: "Friends",
//     tokenId: 1,
//     price: 0.01,
//   },
//   { url: url2, collection: "Friends", tokenId: 2, price: 0.02 },
//   { url: url3, collection: "Friends", tokenId: 3, price: 0.03 },
//   { url: url4, collection: "Friends", tokenId: 4, price: 0.04 },
//   { url: url5, collection: "Friends", tokenId: 5, price: 0.05 },
// ];

export default function Listings() {
  const [nftContract, setNftContract] = useState();
  const { contract, walletAddress, boredStudentsAttributes, provider } =
    useGlobalContext();
  console.log("pro", provider);
  const { loading, error, data } = useSubgraph();
  //console.log("data", data);
  const listingsArr = data ? data.listedNFTs : null;

  const collectionsArr = data ? data.createdCollections : null;

  useEffect(() => {
    const initNftContract = async () => {
      const signer = await provider.getSigner();
      const _nftContract = new ethers.Contract(
        boredStudentsAddress,
        boredStudentsABI,
        signer
      );
      console.log("nftc1", _nftContract);
      setNftContract(_nftContract);
    };
    if (provider) initNftContract();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.listContainer}>
        <div className={styles.listCollectionInfoContainer}>
          <div className={styles.listCollectionInfoRow}>
            <p className={styles.listCollectionInfoItem}>
              COLLECTION: {collections[1].name}
            </p>
            <p className={styles.listCollectionInfoItem}>
              BY: {collections[1].team}
            </p>
            <p className={styles.listCollectionInfoItem}>
              ADDRESS: {collections[1].address}
            </p>
          </div>

          <div className={styles.listCollectionInfoRow}>
            <p className={styles.listCollectionInfoItem}>
              DESCRIPTION: {collections[1].description}
            </p>
          </div>
        </div>
        <div className={styles.listContainer2}>
          <div className={styles.listAttributesContainer}>
            <p className={styles.listAttributesText}>Attributes</p>
            <div className={styles.listAttributesContainer2}>
              {collections[1].attributes.map((attribute, id) => (
                <AttributeBox attribute={attribute} key={id} />
              ))}
            </div>
          </div>
          <div className={styles.listCardsContainer}>
            {loading ? (
              <div>Loading...</div>
            ) : !listingsArr ? (
              <div>No Listings</div>
            ) : (
              listingsArr.map((listing, id) => (
                <Listing
                  key={id}
                  listing={listing}
                  collectionsArr={collectionsArr}
                  nftContract={nftContract}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
