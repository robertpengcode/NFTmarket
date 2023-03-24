import { useGlobalContext } from "../context";
import { useState } from "react";

import styles from "@/styles";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../public/kidsLogo.svg";
import matic from "../../public/matic.svg";

export default function Header() {
  const { contract, walletAddress, walletBalance, connectWallet, isAdmin } =
    useGlobalContext();
  const [selectTabId, setSelectTabId] = useState("0");

  const { route } = useRouter();

  if (route === "/" && selectTabId !== "0") {
    setSelectTabId("0");
  } else if (route === "/sell-nft" && selectTabId !== "1") {
    setSelectTabId("1");
  } else if (route === "/admin" && selectTabId !== "2") {
    setSelectTabId("2");
  }

  const convertAddress = (addr) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };
  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleTab = (e) => {
    //console.log("ck", e.target.id);
    setSelectTabId(e.target.id);
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navLogoContainer}>
        <Link href="/" onClick={handleTab}>
          <Image src={logo} alt="logo" className={styles.navLogo} />
        </Link>
        <div className={styles.navLogoContainer1}>
          <div className={styles.navLogoContainer2}>
            <div className={styles.navLogoText1}>O</div>
            <div className={styles.navLogoText1}>U</div>
          </div>
          <div className={styles.navLogoContainer2}>
            <div className={styles.navLogoText1}>R</div>
            <div className={styles.navLogoText1}>S</div>
          </div>
        </div>
        <span className={styles.navLogoText}>NFT Marketplace</span>
      </div>

      <div className="flex flex-row items-center">
        <Link
          href="/"
          value={selectTabId}
          id="0"
          className={
            selectTabId !== "0"
              ? `${styles.navItem} ${styles.navLink}`
              : `${styles.navTabOn}`
          }
          onClick={handleTab}
        >
          Home
        </Link>
        <Link
          href="/sell-nft"
          value={selectTabId}
          id="1"
          className={
            selectTabId !== "1"
              ? `${styles.navItem} ${styles.navLink}`
              : `${styles.navTabOn}`
          }
          onClick={handleTab}
        >
          Sell NFT
        </Link>
        {!isAdmin ? null : (
          <Link
            href="/admin"
            value={selectTabId}
            id="2"
            className={
              selectTabId !== "2"
                ? `${styles.navItem} ${styles.navLink}`
                : `${styles.navTabOn}`
            }
            onClick={handleTab}
          >
            Admin
          </Link>
        )}

        {walletAddress ? (
          <div className={styles.navConnectedBox}>
            <p>{Math.round(walletBalance * 10000) / 10000}</p>
            <Image src={matic} alt="matic" className={styles.navMatic} />
            <p>{showWalletAddress}</p>
          </div>
        ) : (
          <button
            className={`${styles.navItem} ${styles.navButton}`}
            onClick={handleConnect}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}
