import { ChangeEvent, DetailedHTMLProps, FC, LabelHTMLAttributes } from "react";

interface IToggleLabel
  extends DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {
  label: string;
  openOrClosed: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

export const ToggleLabel: FC<IToggleLabel> = ({
  openOrClosed,
  label,
  checked,
  ...props
}) => (
  <label {...props}>
    <input
      checked={checked}
      type="checkbox"
      onChange={(e) => openOrClosed(e)}
    />
    <span>{label}</span>
  </label>
);
