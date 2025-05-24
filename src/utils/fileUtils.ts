/**
 * Utility functions for file operations
 */

/**
 * Escapes special characters in a string to make it safe for use in template literals
 */
export const escapeString = (str: string): string => {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
};

/**
 * Makes a string safe for use in filenames by replacing unsafe characters
 */
export const makeFilenameSafe = (name: string): string => {
    return name
        .replace(/\//g, "slash")
        .replace(/\\/g, "backslash")
        .replace(/:/g, "colon")
        .replace(/\*/g, "asterisk")
        .replace(/\?/g, "question")
        .replace(/"/g, "quote")
        .replace(/</g, "less")
        .replace(/>/g, "greater")
        .replace(/\|/g, "pipe");
};

/**
 * Downloads a file to the user's device
 */
export const downloadFile = (filename: string, obj: File | Blob): void => {
    const url = URL.createObjectURL(obj);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    // Clean up to avoid memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 100);
};
