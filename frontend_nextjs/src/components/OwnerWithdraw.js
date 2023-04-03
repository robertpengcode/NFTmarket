import styles from "@/styles";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context";

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

  const handleOwnerWithdraw = () => {
    console.log("withdraw!!");
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
          {contractBalance ? contractBalance : "0"}
        </p>
      </div>
      <div className="flex flex-row my-1">
        <p className={styles.sellFormLabel}>
          Owner({showWalletAddress})'s Balance in the Contract:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {ownerBalance ? ownerBalance : "0"}
        </p>
      </div>

      <label htmlFor="tokenId" className={styles.sellFormLabel}>
        Withdraw Amount:
      </label>
      <input
        type="text"
        name="withdrawAmount"
        id="withdrawAmount"
        placeholder=" input withdraw amount"
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
