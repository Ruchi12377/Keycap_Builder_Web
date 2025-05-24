import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import React, { memo } from "react";
import type { Field } from "../types/Field";

interface KeycapFieldProps {
  field: Field;
  rowIndex: number;
  updateFieldProperty: <K extends keyof Field>(index: number, key: K, value: Field[K]) => void;
  onRemove: (index: number) => void;
  fieldWidth: number;
}

function KeycapField({
  field,
  rowIndex,
  updateFieldProperty,
  onRemove,
  fieldWidth,
}: KeycapFieldProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <TextField
        value={field.main}
        onChange={(e) => updateFieldProperty(rowIndex, "main", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.shift}
        onChange={(e) => updateFieldProperty(rowIndex, "shift", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.fn}
        onChange={(e) => updateFieldProperty(rowIndex, "fn", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 1}
      />
      <TextField
        value={field.center}
        onChange={(e) => updateFieldProperty(rowIndex, "center", e.target.value)}
        sx={{ mr: 2, width: fieldWidth }}
        disabled={field.type === 0}
      />
      <TextField
        value={field.angle}
        onChange={(e) =>
          updateFieldProperty(rowIndex, "angle", Number.parseInt(e.target.value || "0"))
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
          updateFieldProperty(rowIndex, "type", Number.parseInt(e.target.value, 10))
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
          updateFieldProperty(rowIndex, "needBump", Number.parseInt(e.target.value, 10) === 1)
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
          updateFieldProperty(rowIndex, "model", Number.parseInt(e.target.value, 10))
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

// Memoize the component to prevent unnecessary re-renders
export default memo(KeycapField);
