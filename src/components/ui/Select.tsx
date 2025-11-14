import React from "react";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<{ value: unknown }>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  name,
  required = false,
  fullWidth = true,
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      error={Boolean(error)}
      sx={{
        "& .MuiInputLabel-root": {
          color: "#336B3F",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          backgroundColor: "#C9F8BA",
          "& fieldset": { borderColor: "#336B3F" },
          "&:hover fieldset": { borderColor: "#336B3F" },
          "&.Mui-focused fieldset": { borderColor: "#336B3F" },
        },
        "& .MuiSelect-select": {
          color: "#336B3F",
        },
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}

      <MuiSelect
        label={label}
        value={value || ""}
        name={name}
        onChange={onChange as any}
        disabled={disabled}
      >
        {placeholder && (
          <MenuItem disabled value="">
            {placeholder}
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && (
        <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </FormControl>
  );
};

export default Select;
