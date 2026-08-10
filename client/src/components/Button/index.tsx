type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function Button({
  children,
  type = "button",
  onClick,
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}