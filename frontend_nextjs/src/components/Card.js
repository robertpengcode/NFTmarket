import styles from "@/styles";
import { useGlobalContext } from "../context";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

export default function Card({
  imgURL,
  tokenId,
  seller,
  totalPrice,
  nftContractAddr,
}) {
  const { contract, setShowAlert, setUpdateUI, walletAddress } =
    useGlobalContext();

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };

  const showSellerAddress = !seller
    ? ""
    : seller === walletAddress
    ? "You"
    : convertAddress(seller);

  const handleBuy = async () => {
    if (contract) {
      try {
        const answer = await contract.buyNFT(nftContractAddr, tokenId, {
          value: totalPrice,
        });
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("BoughtNFT", (nftContractAddr, tokenId, buyer) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `Token (${tokenId}) is bought by (${convertAddress(
              buyer
            )}).`,
          });
          setUpdateUI((pre) => !pre);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.cardContainer}>
      <Link href={`${nftContractAddr}/${tokenId}`}>
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
      <p className={styles.cardText}>{ethers.formatEther(totalPrice)} MATIC</p>
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
