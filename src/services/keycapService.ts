/**
 * Service for handling keycap template operations
 */

// Cached keycap template content
let cachedKeycapTemplate: string | null = null;

/**
 * Loads the keycap template from the server
 * Caches the result for future calls
 */
export const loadKeycapTemplate = async (): Promise<string> => {
    if (cachedKeycapTemplate) {
        return cachedKeycapTemplate;
    }

    try {
        const response = await fetch("Keycap.scad", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to load keycap template: ${response.statusText}`,
            );
        }

        const templateContent = await response.text();
        cachedKeycapTemplate = templateContent;
        return templateContent;
    } catch (error) {
        console.error("Error loading keycap template:", error);
        throw error;
    }
};
