import { useState, useEffect } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import { useSubgraph } from "@/hooks/subgraph";
import { useRouter } from "next/router";
import AttributeBox from "@/components/AttributeBox";
import Listing from "@/components/Listing";
import Alert from "@/components/Alert";

export default function Listings() {
  const { contract, nftContract, nft2Contract, showAlert } = useGlobalContext();
  const { loading, error, data } = useSubgraph();
  const router = useRouter();
  const { collectionContract } = router.query;

  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [theNftContract, setTheNftContract] = useState(null);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [marketFeePercent, setMarketFeePercent] = useState("");

  const listingsArr = data ? data.listedNFTs : null;

  const collection = data
    ? data.createdCollections.find(
        (collection) => collection.nftContractAddr === collectionContract
      )
    : null;

  const { collectionURI, royaltyPercent } = collection ? collection : "";

  useEffect(() => {
    async function updateUI() {
      if (collectionURI) {
        const response = await (await fetch(collectionURI)).json();
        setName(response.name);
        setTeam(response.team);
        setDescription(response.description);
        setAttributes(response.attributes);
        setSelectedAttributes(processAttributes(response.attributes));
      }
      if (contract) {
        const _marketFeePercent = await contract.marketFeePercent();
        setMarketFeePercent(_marketFeePercent.toString());
      }
      if (nftContract && nft2Contract) {
        const _theNftContract = [nftContract, nft2Contract].find(
          (_nftContract) =>
            _nftContract.target.toLowerCase() === collectionContract
        );
        setTheNftContract(_theNftContract);
      }
    }
    updateUI();
  }, [collectionContract, collectionURI, contract, nft2Contract, nftContract]);

  function processAttributes(obj) {
    const resultArr = Object.values(obj).flat();
    return resultArr;
  }

  return (
    <div className={styles.pageContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <div className={styles.listContainer}>
        <div className={styles.listCollectionInfoContainer}>
          <div className={styles.listCollectionInfoRow}>
            <p className={styles.listCollectionInfoItem}>COLLECTION: {name}</p>
            <p className={styles.listCollectionInfoItem}>BY: {team}</p>
            <p className={styles.listCollectionInfoItem}>
              ADDRESS: {collectionContract}
            </p>
          </div>

          <div className={styles.listCollectionInfoRow}>
            <p className={styles.listCollectionInfoItem}>
              DESCRIPTION: {description}
            </p>
          </div>
        </div>
        <div className={styles.listContainer2}>
          <div className={styles.listAttributesContainer}>
            <p className={styles.listAttributesText}>Attributes</p>
            <div className={styles.listAttributesContainer2}>
              {!attributes
                ? null
                : Object.entries(attributes).map(([key, value], id) => (
                    <AttributeBox
                      attribute={key}
                      key={id}
                      elements={value}
                      setSelectedAttributes={setSelectedAttributes}
                    />
                  ))}
            </div>
          </div>
          <div className={styles.listCardsContainer}>
            {loading ? (
              <div>Loading...</div>
            ) : !listingsArr ? (
              <div>No Listings</div>
            ) : (
              listingsArr
                .filter(
                  (listing) => listing.nftContractAddr === collectionContract
                )
                .map((listing, id) => (
                  <Listing
                    key={id}
                    listing={listing}
                    nftContract={theNftContract}
                    selectedAttributes={selectedAttributes}
                    marketFeePercent={marketFeePercent}
                    royaltyPercent={royaltyPercent}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
