import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React from "react";
import type { Field } from "../types/Field";
import Buttons from "./Buttons";

interface AppHeaderProps {
  preset: number;
  onPresetChange: (event: SelectChangeEvent<number>) => void;
  size: number
  onSizeChange: (event: SelectChangeEvent<number>) => void;
  fields: Field[];
  setFields: (fields: Field[]) => void;
}

export default function AppHeader({
  preset,
  onPresetChange,
  size,
  onSizeChange,
  fields,
  setFields,
}: AppHeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme: { zIndex: { drawer: number } }) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography variant="body1">Keycap Builder for Web</Typography>
          <KeyboardIcon />
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <FormControl size="small">
            <InputLabel
              id="select-filter-by-field-label"
              style={{ color: "white" }}
            >
              Preset
            </InputLabel>
            <Select
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
              }}
              labelId="select-filter-by-field-label"
              id="select-filter-by-field"
              value={preset}
              onChange={onPresetChange}
            >
              <MenuItem value={0}>ANSI</MenuItem>
              <MenuItem value={1}>Nescius66</MenuItem>
              <MenuItem value={2}>Blank</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel
              id="select-size-label"
              style={{ color: "white" }}
            >
              Size
            </InputLabel>
            <Select
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
              }}
              labelId="select-size-label"
              id="select-size"
              value={size}
              onChange={onSizeChange}
            >
              <MenuItem value={0}>16mm</MenuItem>
              <MenuItem value={1}>18mm</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Please give me a star!" arrow>
            <Button
              variant="text"
              color="inherit"
              sx={{ p: 0 }}
              href="https://github.com/ruchi12377/keycap_builder_web"
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              startIcon={<GitHubIcon fontSize="large" />}
            >
              GitHub
            </Button>
          </Tooltip>
          <Tooltip
            title="If you have any questions, please contact me on Twitter!"
            arrow
          >
            <Button
              variant="text"
              color="inherit"
              sx={{ p: 0 }}
              href="https://twitter.com/ruchi12377"
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              startIcon={<TwitterIcon fontSize="large" />}
            >
              Twitter
            </Button>
          </Tooltip>
        </Stack>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <Buttons fields={fields} setFields={setFields} size={size} />
      </Toolbar>
    </AppBar>
  );
}
