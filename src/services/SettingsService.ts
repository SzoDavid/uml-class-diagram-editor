import {RenderConfiguration} from '../utils/renderer/RenderConfiguration.ts';
import {reactive} from 'vue';

const defaultRenderConfiguration: RenderConfiguration = {
    textSize: 16,
    defaultWidth: 100,
    lineHeight: 24,
    lineMargin: 5,
    tabSize: 10,
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
    accentColorInvalidSelected: '#F06',
    separateObjectParametersWidthLimit: 500,
};

export type SettingsType = { renderer: RenderConfiguration };

const settings: SettingsType = reactive({
    renderer: defaultRenderConfiguration
});

export const useSettingsService = () => {
    const updateSettings = (newSettings: SettingsType) => {
        Object.assign(settings, newSettings);
    };

    return { settings, updateSettings };
};

