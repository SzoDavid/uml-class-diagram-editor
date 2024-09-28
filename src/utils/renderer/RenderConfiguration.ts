export interface RenderConfiguration {
    textSize: number,
    defaultWidth: number,
    lineHeight: number,
    lineMargin: number,
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
}

export const defaultRenderConfiguration: RenderConfiguration = {
    textSize: 16,
    defaultWidth: 100,
    lineHeight: 24,
    lineMargin: 5,
    borderSize: 1,
    underlineDelta: -2,
    underlineWidth: 1,
    showInvalidity: true,
    fillColor: '#FFF',
    fillColorSelected: '#FEFEFF',
    fillColorInvalid: '#FFEFEF',
    fillColorInvalidSelected: '#FFFEFF',
    accentColor: '#000',
    accentColorSelected: '#66F',
    accentColorInvalid: '#F00',
    accentColorInvalidSelected: '#F06'
};