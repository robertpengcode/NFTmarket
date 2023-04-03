import styles from "@/styles";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
//import url1 from "../assets/Karen.png";
//import { SettingsSystemDaydream } from "@mui/icons-material";

export default function CollectionRow({ collection }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [team, setTeam] = useState("");
  const [maxSupply, setMaxSupply] = useState("");

  const { collectionURI, nftContractAddr } = collection;
  //console.log("ck", collectionURI);

  async function updateUI() {
    if (collectionURI) {
      const response = await (await fetch(collectionURI)).json();
      //console.log("res", response);
      //console.log("chichi", response.iconURL);
      setName(response.name);
      setUrl(response.iconURL);
      setTeam(response.team);
      setMaxSupply(response.maxSupply);
    }
  }

  useEffect(() => {
    updateUI();
  }, []);

  return !collection ? (
    <div>No Collection</div>
  ) : (
    <Link
      className={styles.homeCollectionRow}
      // href={{
      //   pathname: "/listings/[collection]",
      //   query: { collection: `${row.collection}` },
      // }}
      //href="/listings"
      //href={`/listings/${nftContractAddr}`}
      href={`/listings/${encodeURIComponent(nftContractAddr)}`}
    >
      <div className={styles.homeCollectionRowItem}>{name}</div>
      <div className={styles.homeCollectionRowItem}>
        {!url ? null : (
          <Image
            src={url}
            alt="collection icon image"
            className={styles.homeCollectionImg}
            width="200"
            height="200"
          />
        )}
      </div>
      <div className={styles.homeCollectionRowItem}>{team}</div>
      <div className={styles.homeCollectionRowItem}>0.01ETH</div>
      <div className={styles.homeCollectionRowItem}>{maxSupply}</div>
    </Link>
  );
}
