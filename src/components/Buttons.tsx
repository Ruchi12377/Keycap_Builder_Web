import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "@mui/material";
import JSZip from "jszip";
import React, { useCallback, useState } from "react";
import { Fragment } from "react";
import { MODEL_PATHS } from "../constants/appConstants";
import { loadKeycapTemplate } from "../services/keycapService";
import type { Field } from "../types/Field";
import { downloadFile, escapeString, makeFilenameSafe } from "../utils/fileUtils";
import LoadingOverlay from "./LoadingOverlay";
import { useOpenSCADProvider } from "./providers/OpenscadWorkerProvider";

interface ButtonsProps {
	fields: Field[];
	setFields: (fields: Field[]) => void;
	size: number;
}

interface LoadingState {
	loading: boolean;
	exportedFile: number;
}

/**
 * Component containing action buttons for the keycap builder
 */
export default function Buttons({ fields, setFields, size }: ButtonsProps) {
	const { execExport, isExporting } = useOpenSCADProvider();
	const [loadingState, setLoadingState] = useState<LoadingState>({
		loading: false,
		exportedFile: 0,
	});

	/**
	 * Handles downloading the current layout as JSON
	 */
	const handleDownload = useCallback(() => {
		const json = JSON.stringify(fields);
		const blob = new Blob([json], { type: "application/json" });
		downloadFile("keycap-builder.json", blob);
	}, [fields]);

	/**
	 * Handles uploading a layout JSON file
	 */
	const handleUpload = useCallback(() => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = () => {
			const file = input.files?.item(0);
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					try {
						const json = reader.result as string;
						const data = JSON.parse(json) as Field[];
						setFields(data);
					} catch (error) {
						console.error("Failed to parse JSON file:", error);
						alert("Invalid layout file format");
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}, [setFields]);

	/**
	 * Creates a customized keycap model based on field values
	 */
	const createKeycapModel = (keycapTemplate: string, field: Field, size: number): string => {
		// size: 0 for 16mm, 1 for 18mm
		// The mini model is located immediately after the standard model in the array,
		// so using (1 - size) selects the correct model: for 18mm (size 1), it uses the standard model,
		// and for 16mm (size 0), it uses the mini model.
		const importModelPath = MODEL_PATHS[field.model + (1 - size)];
		const replacements = {
			LLB: field.type === 0 ? escapeString(field.main) : "",
			LLT: field.type === 0 ? escapeString(field.shift) : "",
			LRT: field.type === 0 ? escapeString(field.fn) : "",
			LC: field.type === 1 ? escapeString(field.center) : "",
			MODEL_PATH: importModelPath,
			CENTER_ROTATION: field.angle.toString(),
			NEED_BUMP: field.needBump.toString(),
		};

		let customKeycap = keycapTemplate;
		for (const [key, value] of Object.entries(replacements)) {
			const regex = new RegExp(key, "g");
			customKeycap = customKeycap.replace(regex, value);
		}

		return customKeycap;
	};

	/**
	 * Generates a filename for the exported keycap model
	 */
	const generateKeycapFilename = (field: Field, size: number): string => {
		const safeLLB = makeFilenameSafe(field.main);
		const safeLLT = makeFilenameSafe(field.shift);
		const safeLRB = makeFilenameSafe(field.fn);
		const safeLC = makeFilenameSafe(field.center);
		const modelType = ["U", "O", "F"][field.model];
		const needBump = field.needBump ? "Bump" : "";
		const modelSize = size === 0 ? "_Mini" : "";

		return field.type === 0
			? `Keycap_${safeLLB}_${safeLLT}_${safeLRB}_${needBump}_${modelType}${modelSize}.stl`
			: `Keycap_${safeLC}_${field.angle}_${needBump}_${modelType}${modelSize}.stl`;
	};

	/**
	 * Exports keycap models for all fields
	 */
	const exportKeycap = async () => {
		try {
			// Load keycap template
			const keycapTemplate = await loadKeycapTemplate();
			const exportedFiles: { file: File; name: string }[] = [];

			// Set initial loading state
			setLoadingState({ loading: true, exportedFile: 0 });

			// Process each field
			for (let index = 0; index < fields.length; index++) {
				const field = fields[index];

				// Create customized keycap model
				const customKeycap = createKeycapModel(keycapTemplate, field, size);
				const filename = generateKeycapFilename(field, size);

				// Export the model
				const stlFile = await execExport(customKeycap);
				exportedFiles.push({ file: stlFile, name: filename });

				// Update progress
				setLoadingState({ loading: true, exportedFile: index + 1 });
			}

			// Handle download - single file or zip archive
			if (exportedFiles.length === 1) {
				const file = exportedFiles[0];
				downloadFile(file.name, file.file);
			} else {
				const zip = new JSZip();
				for (const { name, file } of exportedFiles) {
					zip.file(name, file);
				}

				const zipBlob = await zip.generateAsync({ type: "blob" });
				downloadFile("keycaps.zip", zipBlob);
			}
		} catch (error) {
			console.error("Failed to export keycap:", error);
			alert("Failed to export keycap. See console for details.");
		} finally {
			// Reset loading state
			setLoadingState({ loading: false, exportedFile: 0 });
		}
	};

	// Common button style
	const buttonStyle = {
		borderColor: "#fff",
		color: "#fff",
		"&:hover": {
			borderColor: "#ccc",
			color: "#ccc",
		},
	};

	return (
		<Fragment>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<AutoAwesomeIcon />}
				onClick={exportKeycap}
				sx={buttonStyle}
			>
				Export Keycap
			</Button>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<DownloadIcon />}
				onClick={handleDownload}
				sx={buttonStyle}
			>
				Download Layout
			</Button>
			<Button
				variant="outlined"
				disabled={isExporting}
				endIcon={<UploadIcon />}
				onClick={handleUpload}
				sx={buttonStyle}
			>
				Upload Layout
			</Button>

			{/* Loading overlay with progress indicator */}
			{loadingState.loading && (
				<LoadingOverlay
					current={loadingState.exportedFile}
					total={fields.length}
				/>
			)}
		</Fragment>
	);
}
