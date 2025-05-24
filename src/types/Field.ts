/**
 * Field definition for a keycap configuration.
 */
export interface Field {
    main: string; // Main key label
    shift: string; // Shift key label
    fn: string; // Function key label
    center: string; // Centered key label
    angle: number; // Center key label's angle
    type: number; // Type of label (0: General, 1: Center)
    needBump: boolean; // Whether to add key bump (like F and J keys)
    model: number; // Model type (0: Normal, 1: Pit, 2: Flat)
}

/**
 * Creates a default Field with empty values.
 */
export const createDefaultField = (): Field => {
    return {
        main: "",
        shift: "",
        fn: "",
        center: "",
        angle: 0,
        type: 0,
        needBump: false,
        model: 0,
    };
};
