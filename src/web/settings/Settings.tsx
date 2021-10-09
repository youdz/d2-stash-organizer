import "./Settings.css";
import { useContext } from "preact/hooks";
import { SettingsContext } from "./SettingsContext";

export function Settings() {
  const { accessibleFont, toggleAccessibleFont } = useContext(SettingsContext);

  return (
    <>
      <p>
        <label>
          <input
            type="checkbox"
            name="font"
            checked={!accessibleFont}
            onChange={toggleAccessibleFont}
          />{" "}
          Use Diablo font
        </label>
      </p>
      <p class="sidenote">More settings to come...</p>
    </>
  );
}
