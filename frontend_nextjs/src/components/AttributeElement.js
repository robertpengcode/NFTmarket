import { useState } from "react";
import styles from "@/styles";

export default function AttributeElement({ option, setSelectedAttributes }) {
  const [checked, setChecked] = useState(true);

  const handleCheckbox = (e) => {
    setChecked((pre) => !pre);
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAttributes((pre) => [...pre, value]);
    } else {
      setSelectedAttributes((pre) => pre.filter((opt) => opt !== value));
    }
  };

  return (
    <form className={styles.listAttributesMenuForm}>
      <input
        type="checkbox"
        id={option}
        name={option}
        onChange={handleCheckbox}
        value={option}
        checked={checked}
      />
      <label htmlFor={option} className={styles.listAttributesMenuFormLabel}>
        {option}
      </label>
    </form>
  );
}
