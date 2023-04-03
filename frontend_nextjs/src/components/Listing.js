import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import Image from "next/image";
import Link from "next/link";
import Card from "../components/Card";
import url from "../assets/Karen.png";
//import { SettingsSystemDaydream } from "@mui/icons-material";

export default function Listing({ listing, collectionsArr, nftContract }) {
  const { contract, walletAddress } = useGlobalContext();
  console.log("ck", listing);
  //   const [name, setName] = useState("");
  const [nftImgURL, setNftImgURL] = useState("");

  const { nftContractAddr, tokenId, seller, price } = listing;
  console.log("arr", collectionsArr);

  console.log("nftc", nftContract);

  console.log("tokenid", tokenId);

  const getNftUri = async () => {
    const nftURI = await nftContract.tokenURI(tokenId.toString());
    console.log("any thing?", nftURI);
    const response = await (await fetch(nftURI)).json();
    console.log("res", response);
    setNftImgURL(response.image);
  };

  if (nftContract && tokenId) {
    getNftUri();
  }

  //console.log("any thing?", nftURI);
  //   useEffect(() => {
  //     const getNftUri = async () => {
  //       const nftURI = await nftContract.getURI(tokenId);
  //       console.log("any thing?", nftURI);
  //     };
  //     if (nftContract) getNftUri();
  //   });

  //   const collection = collectionsArr
  //     ? collectionsArr.filter(
  //         (collection) => collection.nftContractAddr === nftContractAddr
  //       )
  //     : "ohoh";
  //   console.log("check", collection);

  //   async function updateUI() {
  //     if (collectionURI) {
  //       const response = await (await fetch(collectionURI)).json();
  //       //console.log("res", response);
  //       //console.log("chichi", response.iconURL);

  //       setNftUrl(response.iconURL);
  //     }
  //   }

  //   useEffect(() => {
  //     updateUI();
  //   }, []);

  return !listing ? (
    <div>No Listing</div>
  ) : (
    <Card
      imgURL={nftImgURL}
      tokenId={tokenId}
      seller={seller}
      price={price}
      walletAddress={walletAddress}
    />
  );
}

{
  /* {!listingsArr ? <div>No Listing</div> :
            {listingsArr.map((listing, idx) => (
              <Link href="/nft" key={idx}>
                <Card
                  url={listing.url}
                  collection={listing.collection}
                  tokenId={listing.tokenId}
                  price={listing.price}
                />
              </Link>
            ))}} */
}

{
  /* <Link
className={styles.homeCollectionRow}
// href={{
//   pathname: "/listings/[collection]",
//   query: { collection: `${row.collection}` },
// }}
href="/listings"
//href={`/listings/${row.collection}`}
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
</Link> */
}
