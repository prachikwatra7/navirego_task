import React from "react";
import { MouseEvent } from "react";
import Tick1 from "../Tick1";
import "./Checkbox.css";

// CheckBox PropsType
type CheckboxProps = {
  checked: boolean;
  onChange?(e: MouseEvent<HTMLElement | HTMLDivElement>): void;
  label?: string;
};

// Checkbox Component
const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
  return (
    <div className="checkBox">
      <div className="checkBox__container" onClick={onChange}>
        <div className="checkBox__container--inner">{checked && <Tick1 />}</div>
      </div>
      {label && <div>{label}</div>}
    </div>
  );
};

export default Checkbox;
