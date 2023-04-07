import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { ethers } from "ethers";

export default function UserWithdraw() {
  const { contract, walletAddress } = useGlobalContext();
  const [userBalance, setUserBalance] = useState("");

  useEffect(() => {
    const getUserBalance = async () => {
      if (contract) {
        const _userBalance = (
          await contract.getUserProceed(walletAddress)
        ).toString();
        setUserBalance(_userBalance);
      }
    };
    getUserBalance();
  }, []);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  const handleUserWithdraw = async () => {
    if (contract) {
      try {
        await contract.usersWithdraw();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form
      className={styles.sellFormContainer}
      onSubmit={(event) => {
        event.preventDefault();
        handleUserWithdraw();
      }}
    >
      <div className="flex flex-row my-1">
        <p className={styles.sellFormLabel}>
          User({showWalletAddress})'s Proceed in the Contract:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {userBalance ? ethers.formatEther(userBalance) : ""} MATIC
        </p>
      </div>

      <button type="submit" className={styles.sellFormButton}>
        Withdraw Proceed
      </button>
    </form>
  );
}
