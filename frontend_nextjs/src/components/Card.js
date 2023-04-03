import styles from "@/styles";
import Image from "next/image";
import { ethers } from "ethers";
import Link from "next/link";

export default function Card({
  imgURL,
  tokenId,
  seller,
  price,
  walletAddress,
}) {
  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showSellerAddress = !seller
    ? ""
    : seller === walletAddress
    ? "You"
    : convertAddress(seller);

  const handleBuy = () => {
    console.log("buy buy");
  };

  return (
    <div className={styles.cardContainer}>
      <Link href="/nft">
        {!imgURL ? null : (
          <Image
            className={styles.cardImage}
            src={imgURL}
            alt={tokenId}
            width={200}
            height={200}
          />
        )}
      </Link>

      <p className={styles.cardText}>#{tokenId}</p>
      <p className={styles.cardText}>Owned By {showSellerAddress}</p>
      <p className={styles.cardText}>{ethers.formatEther(price)} MATIC</p>
      <button
        className={styles.cardButton}
        disabled={seller === walletAddress}
        onClick={handleBuy}
      >
        Buy Now
      </button>
    </div>
  );
}
