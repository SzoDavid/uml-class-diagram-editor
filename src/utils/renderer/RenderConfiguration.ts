export interface RenderConfiguration {
    textSize: number,
    defaultWidth: number,
    lineHeight: number,
    lineMargin: number,
    borderSize: number,
    underlineDelta: number,
    underlineWidth: number,
    fillColor: string,
    fillColorSelected: string,
    accentColor: string,
    accentColorSelected: string
}

export const defaultRenderConfiguration: RenderConfiguration = {
    textSize: 16,
    defaultWidth: 100,
    lineHeight: 24,
    lineMargin: 5,
    borderSize: 1,
    underlineDelta: -2,
    underlineWidth: 1,
    fillColor: '#FFF',
    fillColorSelected: '#FEFEFF',
    accentColor: '#000',
    accentColorSelected: '#66F'
};