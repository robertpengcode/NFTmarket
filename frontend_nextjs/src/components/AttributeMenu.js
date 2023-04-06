import styles from "@/styles";
import AttributeElement from "./AttributeElement";

export default function AttributeMenu({ elements, setSelectedAttributes }) {
  return (
    <div className={styles.listAttributesMenu}>
      {elements.map((option, id) => (
        <AttributeElement
          key={id}
          option={option}
          setSelectedAttributes={setSelectedAttributes}
        />
      ))}
    </div>
  );
}
