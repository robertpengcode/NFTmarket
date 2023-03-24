import Card from "../components/Card";
import url1 from "../assets/Karen.png";
import url2 from "../assets/SuperKitty.png";
import url3 from "../assets/BaconPro769.png";
import url4 from "../assets/Fortnitelilbro.png";
import url5 from "../assets/Meowmeow.png";
import styles from "@/styles";
import { useState } from "react";
import { useGlobalContext } from "../context";
import Link from "next/link";
import Menu from "@/components/AttributeMenu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AttributeBox from "@/components/AttributeBox";

const listingsArr = [
  {
    url: url1,
    collection: "Friends",
    tokenId: 1,
    price: 0.01,
  },
  { url: url2, collection: "Friends", tokenId: 2, price: 0.02 },
  { url: url3, collection: "Friends", tokenId: 3, price: 0.03 },
  { url: url4, collection: "Friends", tokenId: 4, price: 0.04 },
  { url: url5, collection: "Friends", tokenId: 5, price: 0.05 },
];

export default function Listings() {
  const { contract, walletAddress, collections, boredStudentsAttributes } =
    useGlobalContext();
  //const [showMenu, setShowMenu] = useState(false);

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
            {listingsArr.map((listing, idx) => (
              <Link href="/nft" key={idx}>
                <Card
                  url={listing.url}
                  collection={listing.collection}
                  tokenId={listing.tokenId}
                  price={listing.price}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
