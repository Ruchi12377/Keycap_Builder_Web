import { Box, type SelectChangeEvent, Toolbar } from "@mui/material";
import React, { Fragment, useCallback, useMemo } from "react";
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
	// 1 represents the default size (18mm)
	const [size, setSize] = useState(1);

	// Add a new field
	const handleAddField = useCallback(() => {
		setFields((prevFields) => [...prevFields, createDefaultField()]);
	}, []);

	// Remove a field - optimized for performance
	const handleRemoveField = useCallback((index: number) => {
		setFields((prevFields) => {
			// Return early if it's the last field
			if (prevFields.length === 1) {
				return [createDefaultField()];
			}

			// Directly create a new array without filter (more efficient)
			const newFields = [
				...prevFields.slice(0, index),
				...prevFields.slice(index + 1)
			];
			return newFields;
		});
	}, []);

	// Update a specific field property efficiently
	const updateFieldProperty = useCallback(<K extends keyof Field>(
		index: number,
		key: K,
		value: Field[K]
	) => {
		setFields((prevFields) => {
			// Only create a new array if we're actually changing something
			if (prevFields[index][key] === value) return prevFields;

			const newFields = [...prevFields];
			newFields[index] = { ...newFields[index], [key]: value };
			return newFields;
		});
	}, []);

	// Load a preset layout
	const loadPreset = useCallback((presetIndex: number) => {
		if (presetIndex < 0 || presetIndex >= PRESETS.length) return;

		const newFields = PRESETS[presetIndex].map((field: Field) => ({
			...field,
		}));
		setFields(newFields);
	}, []);

	// Handle preset selection change
	const handlePresetChange = useCallback((event: SelectChangeEvent<number>) => {
		const newPreset = event.target.value as number;
		setPreset(newPreset);
		loadPreset(newPreset);
	}, [loadPreset]);

	// Handle size selection change
	const handleSizeChange = useCallback((event: SelectChangeEvent<number>) => {
		const newSize = event.target.value as number;
		setSize(newSize);
	}, []);

	// Load default ANSI layout on initialization
	useEffect(() => {
		loadPreset(0);
	}, [loadPreset]);

	// Memoize the keycap fields to prevent unnecessary renders
	const keycapFields = useMemo(() => {
		return fields.map((field, rowIndex) => (
			<KeycapField
				key={rowIndex}
				field={field}
				rowIndex={rowIndex}
				updateFieldProperty={updateFieldProperty}
				onRemove={handleRemoveField}
				fieldWidth={FIELD_WIDTH}
			/>
		));
	}, [fields, updateFieldProperty, handleRemoveField]);

	return (
		<Fragment>
			{/* App Header */}
			<AppHeader
				preset={preset}
				onPresetChange={handlePresetChange}
				size={size}
				onSizeChange={handleSizeChange}
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
							{keycapFields}
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Footer */}
			<AppFooter />
		</Fragment>
	);
}
