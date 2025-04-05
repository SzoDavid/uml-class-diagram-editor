export enum ClassAbstractionDisplayMode {
    ITALIC,
    KEYWORD,
}

export interface RenderConfiguration {
    textSize: number;
    defaultWidth: number; // The minimum width of a node
    lineHeight: number; // How high a line of text is (text is rendered at the middle of this line)
    lineMargin: number; // On the sides, how much space to leave between the text and the border
    tabSize: number;
    borderSize: number;
    underlineDelta: number; // Measured from the bottom of the text, how low should the underline appear
    underlineWidth: number; // Like border size, but for the underlines
    showInvalidity: boolean;
    fillColor: string;
    fillColorSelected: string;
    fillColorInvalid: string;
    fillColorInvalidSelected: string;
    accentColor: string;
    accentColorSelected: string;
    accentColorInvalid: string;
    accentColorInvalidSelected: string;
    separateObjectParametersWidthLimit: number; // When for example operation texts are very long, at what length to start to render them in multiple lines
    dotSize: number; // When rendering connection points as selected, the radius of the dots appearing at these points
    options: {
        gridSize: number;
        classAbstractionDisplayMode: ClassAbstractionDisplayMode;
    };
}
