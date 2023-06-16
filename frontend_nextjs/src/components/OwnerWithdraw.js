import { useState, useEffect } from "react";
import styles from "@/styles";
import { useGlobalContext } from "../context";
import { ethers } from "ethers";

export default function OwnerWithdraw() {
  const {
    contract,
    walletAddress,
    setShowAlert,
    walletProvider,
    setWalletBalance,
    convertAddress,
    signer,
  } = useGlobalContext();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [ownerBalance, setOwnerBalance] = useState("");
  const [updateBalance, setUpdateBalance] = useState(false);

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
  }, [updateBalance, contract]);

  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";
  //ethers.js v6
  //const showContractAddress = contract ? convertAddress(contract.target) : "";
  const showContractAddress = contract ? convertAddress(contract.address) : "";

  const updateAccountBalance = async () => {
    //const balance = (await provider.getBalance(walletAddress)).toString();
    const balance = (await walletProvider.getBalance(walletAddress)).toString();
    const balanceInETH = ethers.utils.formatEther(balance);
    setWalletBalance(balanceInETH);
  };

  const handleOwnerWithdraw = async () => {
    const withdrawInWei = ethers.utils.parseEther(withdrawAmount);
    if (contract) {
      try {
        const answer = await contract
          .connect(signer)
          .ownerWithdrawFee(withdrawInWei);
        if (answer) {
          setShowAlert({
            status: true,
            type: "info",
            message: `Request sent! Please wait a few seconds for confirmation.`,
          });
        }
        contract.on("MarketOwnerWithdrew", (owner, amount) => {
          setShowAlert({
            status: true,
            type: "success",
            message: `User (${convertAddress(
              owner
            )}) withdrew ${ethers.utils.formatEther(amount)} MATIC.`,
          });
          setUpdateBalance(!updateBalance);
          updateAccountBalance();
          setWithdrawAmount("");
        });
      } catch (error) {
        console.log(error);
        setShowAlert({
          status: true,
          type: "failure",
          message: `Something went wrong.`,
        });
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
          Contract({showContractAddress}) Balance:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {contractBalance ? ethers.utils.formatEther(contractBalance) : ""}{" "}
          MATIC
        </p>
      </div>
      <div className="flex flex-row my-1">
        <p className={styles.sellFormLabel}>
          Owner({showWalletAddress}) Balance in the Contract:{" "}
        </p>
        <p className={styles.sellFormLabel}>
          {ownerBalance ? ethers.utils.formatEther(ownerBalance) : ""} MATIC
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
