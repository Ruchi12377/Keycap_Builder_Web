import Ansi from "../presets/ansi.json";
import Nescius66 from "../presets/nescius66.json";
import { createDefaultField, type Field } from "../types/Field";

export const FIELD_WIDTH = 140;
export const TOOLBAR_HEIGHT = 64;

export const PRESETS: Field[][] = [
    Ansi as Field[],
    Nescius66 as Field[],
    [createDefaultField()],
];

export const MODEL_PATHS = ["Cap_U.stl", "Cap_O.stl", "Cap_Flat.stl"];
