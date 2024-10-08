export enum ClassAbstractionDisplayMode {
    ITALIC,
    KEYWORD
}

export interface RenderConfiguration {
    textSize: number,
    defaultWidth: number,
    lineHeight: number,
    lineMargin: number,
    tabSize: number,
    borderSize: number,
    underlineDelta: number,
    underlineWidth: number,
    showInvalidity: boolean,
    fillColor: string,
    fillColorSelected: string,
    fillColorInvalid: string,
    fillColorInvalidSelected: string,
    accentColor: string,
    accentColorSelected: string,
    accentColorInvalid: string,
    accentColorInvalidSelected: string,
    separateObjectParametersWidthLimit: number,
    options: {
        classAbstractionDisplayMode: ClassAbstractionDisplayMode;
    }
}