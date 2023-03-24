import styles from "@/styles";
import { useGlobalContext } from "../context";
import { useState } from "react";
import AttributeMenu from "@/components/AttributeMenu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function AttributeBox({ attribute }) {
  //   const { contract, walletAddress, collections, boredStudentsAttributes } =
  //     useGlobalContext();
  const [showMenu, setShowMenu] = useState(false);

  const handleShow = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={styles.listAttributesBox}>
      <div className={styles.listAttributesItem} onClick={handleShow}>
        <p>{attribute}</p>
        {!showMenu ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </div>
      {!showMenu ? null : <AttributeMenu attribute={attribute} />}
    </div>
  );
}
