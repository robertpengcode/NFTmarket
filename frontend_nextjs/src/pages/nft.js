import url1 from "../assets/Karen.png";
import styles from "@/styles";
import Image from "next/image";
import { useGlobalContext } from "../context";

export default function Nft() {
  const { contract, walletAddress, collections } = useGlobalContext();

  const sampleNFT1 = {
    name: "Karen",
    description: "One of the Friends",
    image: "ipfs://Qmf8XmPacaNF4N4UBiDH9Q18GNph4g8PK1tfWqvv8yMH73",
    attributes: [
      {
        personality: "mean",
      },
      { skill: "roasting-people" },
      { greeting: "Did you do your homework?" },
    ],
  };

  const sampleNFT2 = {
    name: "Noach",
    description: "One of the Bored Students",
    image: "ipfs://Qmf8XmPacaNF4N4UBiDH9Q18GNph4g8PK1tfWqvv8yMH73",
    attributes: [
      {
        trait_type: "background",
        value: "blue",
      },
      {
        trait_type: "eyes",
        value: "open",
      },
      {
        trait_type: "mouth",
        value: "smile",
      },
      {
        trait_type: "hair",
        value: "short",
      },
      {
        trait_type: "color",
        value: "yellow",
      },
      {
        trait_type: "clothing",
        value: "tie",
      },
    ],
  };

  const sampleNFT3 = {
    name: "Bob",
    description: "One of the Crypto Robots",
    image: "ipfs://Qmf8XmPacaNF4N4UBiDH9Q18GNph4g8PK1tfWqvv8yMH73",
    attributes: [
      { background: "gray" },
      { type: "fight" },
      { height: "normal" },
      { mood: "bad" },
      { tool: "gun" },
      { color: "silver" },
    ],
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.nftContainer}>
        <div className={styles.nftInfoLeft}>
          <div className={styles.nftInfoLeftItem}>{collections[0].name} #1</div>
          <div className={styles.nftInfoLeftItem}>
            by: {collections[0].team}
          </div>
          <div className={styles.nftImageContainer}>
            <Image src={url1} alt="nft image" className={styles.nftImage} />
          </div>
          <button className={styles.nftBTN}>Buy Now</button>
        </div>
        <div className={styles.nftInfoRight}>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>Name</p>
            <div className={styles.nftDescriptionContainer}>
              {sampleNFT2.name}
            </div>
          </div>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>Description</p>
            <div className={styles.nftDescriptionContainer}>
              {sampleNFT2.description}
            </div>
          </div>
          <div className={styles.nftInfoRightItem}>
            <p className={styles.nftInfoRightItemText}>
              Attributes {`(${sampleNFT2.attributes.length})`}
            </p>
            <div className={styles.nftAttributesContainer}>
              {sampleNFT2.attributes.map((attribute, id) => (
                <div className={styles.nftAttributeBox} key={id}>
                  <div className={styles.nftAttributeKey}>
                    {attribute.trait_type}
                  </div>
                  <div className={styles.nftAttributeValue}>
                    {attribute.value}
                  </div>
                  <div className={styles.nftAttributeRare}>rare</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
