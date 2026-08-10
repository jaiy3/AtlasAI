type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}