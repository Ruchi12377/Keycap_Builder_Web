import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import FieldHeader from "./FieldHeader";

interface FieldSectionHeaderProps {
  onAddField: () => void;
  fieldWidth: number;
}

export default function FieldSectionHeader({
  onAddField,
  fieldWidth,
}: FieldSectionHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <FieldHeader
        title="Main"
        tooltip="Main key label"
        width={fieldWidth}
      />
      <FieldHeader
        title="Shift"
        tooltip="Shift key label"
        width={fieldWidth}
      />
      <FieldHeader
        title="Fn"
        tooltip="Function key label"
        width={fieldWidth}
      />
      <FieldHeader
        title="Center"
        tooltip="Centered key label. ex) ▲ ←"
        width={fieldWidth}
      />
      <FieldHeader
        title="Center Angle"
        tooltip="Center key label's angle"
        width={fieldWidth}
      />
      <FieldHeader
        title="Label Type"
        tooltip="Type of label. Normal or Centered"
        width={fieldWidth}
      />
      <FieldHeader
        title="Key Bump"
        tooltip={"Put key bump like F and J key"}
        expandable
        width={fieldWidth}
      />
      <FieldHeader
        title="Model Type"
        tooltip={
          <img src="model.jpg" alt="Type of model" width={500} />
        }
        expandable
        width={fieldWidth}
      />
      <Typography sx={{ mr: 2, width: fieldWidth }}>
        <IconButton color="primary" onClick={onAddField}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Typography>
    </Box>
  );
}
