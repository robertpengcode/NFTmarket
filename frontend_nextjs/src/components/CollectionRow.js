import { useState, useEffect } from "react";
import styles from "@/styles";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

export default function CollectionRow({ collection, listingsArr }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [team, setTeam] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [floor, setFloor] = useState("");

  const { collectionURI, nftContractAddr } = collection;

  useEffect(() => {
    const calculateFloor = async (listings) => {
      if (!listings.length) {
        setFloor("0");
        return;
      }
      const arr = listings.map((listing) =>
        Number(ethers.formatEther(listing.price))
      );
      const _floor = Math.min(...arr).toString();
      setFloor(_floor);
    };
    if (listingsArr) {
      calculateFloor(listingsArr);
    }
  }, []);

  async function updateUI() {
    if (collectionURI) {
      const response = await (await fetch(collectionURI)).json();
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
    <Link className={styles.homeCollectionRow} href={`/${nftContractAddr}`}>
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
      <div className={styles.homeCollectionRowItem}>{floor} MATIC</div>
      <div className={styles.homeCollectionRowItem}>{maxSupply}</div>
    </Link>
  );
}
