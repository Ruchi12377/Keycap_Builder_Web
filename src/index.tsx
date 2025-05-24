import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React from "react";
import { createRoot } from "react-dom/client";
import OpenscadWorkerProvider from "./components/providers/OpenscadWorkerProvider";
import Workspace from "./components/Workspace";

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<CssBaseline />
		<SnackbarProvider />
		<OpenscadWorkerProvider>
			<Workspace />
		</OpenscadWorkerProvider>
	</React.StrictMode>,
);

window.addEventListener("unhandledrejection", (event) => {
	enqueueSnackbar(event.reason.message, { variant: "error" });
});

window.addEventListener("error", (event) => {
	enqueueSnackbar(event.message, { variant: "error" });
});
