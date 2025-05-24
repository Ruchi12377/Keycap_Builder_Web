import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import React from "react";
import type { Field } from "../types/Field";

interface KeycapFieldProps {
  field: Field;
  rowIndex: number;
  fields: Field[];
  setFields: (fields: Field[]) => void;
  onRemove: (index: number) => void;
  fieldWidth: number;
}

export default function KeycapField({
  field,
  rowIndex,
  fields,
  setFields,
  onRemove,
  fieldWidth,
}: KeycapFieldProps) {
  const updateField = <K extends keyof Field>(key: K, value: Field[K]) => {
    const newFields = [...fields];
    newFields[rowIndex][key] = value;
    setFields(newFields);
  };

  return (
    <Box key={rowIndex} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <TextField
        value={field.main}
        onChange={(e) => updateField("main", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.shift}
        onChange={(e) => updateField("shift", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.fn}
        onChange={(e) => updateField("fn", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.center}
        onChange={(e) => updateField("center", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 0}
      />
      <TextField
        value={field.angle}
        onChange={(e) =>
          updateField("angle", Number.parseInt(e.target.value || "0"))
        }
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 0}
      />
      <TextField
        select
        value={field.type}
        onChange={(e) =>
          updateField("type", Number.parseInt(e.target.value, 10))
        }
        sx={{ mr: 2, width: fieldWidth }}
      >
        <MenuItem value={0}>General</MenuItem>
        <MenuItem value={1}>Center</MenuItem>
      </TextField>
      <TextField
        select
        value={field.needBump ? 1 : 0}
        onChange={(e) =>
          updateField("needBump", Number.parseInt(e.target.value, 10) === 1)
        }
        sx={{ mr: 2, width: fieldWidth }}
      >
        <MenuItem value={0}>No</MenuItem>
        <MenuItem value={1}>Yes</MenuItem>
      </TextField>
      <TextField
        select
        value={field.model}
        onChange={(e) =>
          updateField("model", Number.parseInt(e.target.value, 10))
        }
        sx={{ mr: 2, width: fieldWidth }}
      >
        <MenuItem value={0}>Normal</MenuItem>
        <MenuItem value={1}>Pit</MenuItem>
        <MenuItem value={2}>Flat</MenuItem>
      </TextField>
      <IconButton color="secondary" onClick={() => onRemove(rowIndex)}>
        <DeleteIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
