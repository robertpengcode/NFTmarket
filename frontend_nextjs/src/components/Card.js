import styles from "@/styles";
import Image from "next/image";

export default function Card({ url, collection, tokenId, price }) {
  return (
    <div className={styles.cardContainer}>
      <Image
        className={styles.cardImage}
        src={url}
        alt={`${collection}${tokenId}`}
      />
      <p className={styles.cardText}>
        {collection} #{tokenId}
      </p>
      <p className={styles.cardText}>{price} ETH</p>
      <button className={styles.cardButton}>Buy Now</button>
    </div>
  );
}
