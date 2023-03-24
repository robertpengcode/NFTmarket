import styles from "@/styles";
import { useGlobalContext } from "../context";

export default function AttributeMenu({ attribute }) {
  const { boredStudentsAttributes } = useGlobalContext();

  return (
    <div className={styles.listAttributesMenu}>
      {boredStudentsAttributes[attribute].map((option, id) => (
        <form key={id} className={styles.listAttributesMenuForm}>
          <input type="checkbox" id={option} name={option} />
          <label
            htmlFor={option}
            className={styles.listAttributesMenuFormLabel}
          >
            {option}
          </label>
        </form>
      ))}
    </div>
  );
}
