import { Box, type SelectChangeEvent, Toolbar } from "@mui/material";
import React, { Fragment, useCallback } from "react";
import { useEffect, useState } from "react";
import {
	FIELD_WIDTH,
	PRESETS,
	TOOLBAR_HEIGHT,
} from "../constants/appConstants";
import { type Field, createDefaultField } from "../types/Field";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import FieldSectionHeader from "./FieldSectionHeader";
import KeycapField from "./KeycapField";

export default function Workspace() {
	const [fields, setFields] = useState<Field[]>([createDefaultField()]);
	const [preset, setPreset] = useState(0);

	// Add a new field
	const handleAddField = () => {
		setFields([...fields, createDefaultField()]);
	};

	// Remove a field
	const handleRemoveField = (index: number) => {
		const newFields = fields.filter((_, i) => i !== index);
		// Ensure at least one field is always present
		if (newFields.length === 0) {
			setFields([createDefaultField()]);
		} else {
			setFields(newFields);
		}
	};

	// Load a preset layout
	const loadPreset = useCallback((presetIndex: number) => {
		if (presetIndex < 0 || presetIndex >= PRESETS.length) return;

		const newFields = PRESETS[presetIndex].map((field: Field) => ({
			...field,
		}));
		setFields(newFields);
	}, []);

	// Handle preset selection change
	const handlePresetChange = (event: SelectChangeEvent<number>) => {
		const newPreset = event.target.value as number;
		setPreset(newPreset);
		loadPreset(newPreset);
	};

	// Load default ANSI layout on initialization
	useEffect(() => {
		loadPreset(0);
	}, [loadPreset]);

	return (
		<Fragment>
			{/* App Header */}
			<AppHeader
				preset={preset}
				onPresetChange={handlePresetChange}
				fields={fields}
				setFields={setFields}
			/>

			{/* Main Content */}
			<Box component="main" sx={{ flexGrow: 1, pt: 0 }}>
				<Toolbar />
				<Box
					component="div"
					sx={{
						width: "100vw",
						height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
						overflow: "auto",
					}}
				>
					<Box
						sx={{
							padding: "20px",
							display: "flex",
							overflow: "scroll",
							gap: 1,
						}}
					>
						<Box sx={{ flex: 1 }}>
							{/* Field Headers */}
							<FieldSectionHeader
								onAddField={handleAddField}
								fieldWidth={FIELD_WIDTH}
							/>

							{/* Field Rows */}
							{fields.map((field, rowIndex) => (
								<KeycapField
									key={rowIndex}
									field={field}
									rowIndex={rowIndex}
									fields={fields}
									setFields={setFields}
									onRemove={handleRemoveField}
									fieldWidth={FIELD_WIDTH}
								/>
							))}
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Footer */}
			<AppFooter />
		</Fragment>
	);
}
