import { useState, useEffect } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import { ethers } from "ethers";

export default function OwnerWithdraw() {
  const { contract, walletAddress } = useGlobalContext();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [ownerBalance, setOwnerBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      if (contract) {
        const _contractBalance = (
          await contract.getContractBalance()
        ).toString();
        setContractBalance(_contractBalance);
        const _ownerBalance = (await contract.getMarketFeeBalance()).toString();
        setOwnerBalance(_ownerBalance);
      }
    };
    getBalance();
  }, []);

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";
  const showContractAddress = contract ? convertAddress(contract.target) : "";

  const handleOwnerWithdraw = async () => {
    const withdrawInWei = ethers.parseEther(withdrawAmount);
    if (contract) {
      try {
        await contract.ownerWithdrawFee(withdrawInWei);
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
        handleOwnerWithdraw();
      }}
    >
      <div className="flex flex-row my-1">
        <p className={styles.sellFormLabel}>
          Contract({showContractAddress})'s Balance:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {contractBalance ? ethers.formatEther(contractBalance) : ""} MATIC
        </p>
      </div>
      <div className="flex flex-row my-1">
        <p className={styles.sellFormLabel}>
          Owner({showWalletAddress})'s Balance in the Contract:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {ownerBalance ? ethers.formatEther(ownerBalance) : ""} MATIC
        </p>
      </div>

      <label htmlFor="tokenId" className={styles.sellFormLabel}>
        Withdraw Amount in MATIC:
      </label>
      <input
        type="text"
        name="withdrawAmount"
        id="withdrawAmount"
        placeholder=" input withdraw amount in MATIC"
        className={styles.sellFormInput}
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <button type="submit" className={styles.sellFormButton}>
        Owner Withdraw
      </button>
    </form>
  );
}
