import { useEffect, useState } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import { useSubgraph } from "@/hooks/subgraph";
import CollectionRow from "../components/CollectionRow";
import Spinner from "@/components/Spinner";
import Head from "next/head";

export default function Home() {
  const { updateUI } = useGlobalContext();
  const { loading, error, data, refetch } = useSubgraph();

  const collectionsArr = data ? data.createdCollections : null;

  const listingsArr = data ? data.listedNFTs : null;

  useEffect(() => {
    refetch();
  }, [updateUI, refetch]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/nft.png" />
      </Head>

      <div className={`${styles.pageContainer} ${styles.homePageContainer}`}>
        <div className={styles.homeCollectionContainer}>
          <div className={styles.homeBigTextContainer}>
            <p className={styles.formTextBig}>Our Collections</p>
          </div>
          <div className={styles.homeCollectionTable} role="table">
            <div className={styles.homeCollectionHeadRow}>
              <div className={styles.homeCollectionRowItemBig}>Collection</div>
              <div className={styles.homeCollectionRowItem}>By</div>
              <div className={styles.homeCollectionRowItem}>Floor Price</div>
              <div className={styles.homeCollectionRowItem}>Max Supply</div>
            </div>
            {loading ? (
              <div className="m-4">
                <Spinner />
              </div>
            ) : !collectionsArr ? (
              <div>No Collections</div>
            ) : (
              collectionsArr.map((collection, id) => (
                <CollectionRow
                  key={id}
                  collection={collection}
                  listingsArr={listingsArr.filter(
                    (listing) =>
                      listing.nftContractAddr === collection.nftContractAddr
                  )}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
