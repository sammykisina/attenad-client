import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode, FC } from "react";

const button_styles = cva(
  "flex items-center justify-center px-4 py-2 rounded-full  focus:outline-none whitespace-nowrap",
  {
    variants: {
      intent: {
        primary: "bg-secondary text-white",
        secondary: "hover:bg-primary hover:text-white text-primary",
        danger: "bg-red-500 text-white",
        link: "text-dark font-semibold",
      },
      type: {
        small: "h-[38px] gap-[6px] text-[14px] tracking-wider",
        medium: "h-[40px] gap-[8px] px-[16px] text-[16px]",
        large: "h-[56px] gap-[8px] px-[20px] text-[18px]",
      },
      full_width: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

interface ButtonProps extends VariantProps<typeof button_styles> {
  title?: string | ReactNode;
  icon?: ReactNode;
  icon_wrapper_styles?: string;
  purpose?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  intent,
  full_width,
  type,
  icon,
  title,
  purpose,
  icon_wrapper_styles,
  disabled,
}) => {
  return (
    <button
      onClick={purpose}
      type="submit"
      className={button_styles({ intent, full_width, type })}
      disabled={disabled}
    >
      {icon && <span className={`${icon_wrapper_styles}`}>{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
