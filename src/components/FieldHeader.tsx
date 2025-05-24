import InfoIcon from "@mui/icons-material/Info";
import { Box, IconButton, Tooltip, Typography, styled } from "@mui/material";
import { type TooltipProps, tooltipClasses } from "@mui/material";
import React, { type ReactElement } from "react";

interface FieldHeaderProps {
  title: string;
  tooltip: string | ReactElement;
  expandable?: boolean;
  width: number;
}

const ExpandableTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

export default function FieldHeader({
  title,
  tooltip,
  expandable = false,
  width,
}: FieldHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mr: 2,
        width,
      }}
    >
      <Typography>{title}</Typography>
      {expandable ? (
        <ExpandableTooltip title={tooltip} arrow>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </ExpandableTooltip>
      ) : (
        <Tooltip title={tooltip} arrow>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
