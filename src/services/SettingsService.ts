import {ClassAbstractionDisplayMode, RenderConfiguration} from './renderer/RenderConfiguration.ts';
import {reactive} from 'vue';

const defaultRenderConfiguration: RenderConfiguration = {
    textSize: 20,
    defaultWidth: 100,
    lineHeight: 30,
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
    dotSize: 4,
    options: {
        gridSize: 15,
        classAbstractionDisplayMode: ClassAbstractionDisplayMode.ITALIC
    }
};

export type SettingsType = { renderer: RenderConfiguration };

const initConfig = () => {
    const savedSettings = localStorage.getItem('render-settings');
    const config = defaultRenderConfiguration;

    if (savedSettings) {
        Object.assign(config, JSON.parse(savedSettings));
    }

    return config;
};

const settings: SettingsType = reactive({
    renderer: initConfig()
});

export const useSettingsService = () => {
    const updateSettings = (newSettings: SettingsType) => {
        Object.assign(settings, newSettings);
    };

    const updateRenderSettings = (newSettings: RenderConfiguration) => {
        Object.assign(settings.renderer, newSettings);
    };

    const resetRenderSettings = () => {
        Object.assign(settings.renderer, {
            textSize: 20,
            defaultWidth: 100,
            lineHeight: 30,
            lineMargin: 5,
            tabSize: 10,
            borderSize: 1,
            underlineDelta: -2,
            underlineWidth: 1,
            separateObjectParametersWidthLimit: 500,
            dotSize: 4,
        });
    };

    const saveRenderSettings = () => {
        localStorage.setItem('render-settings', JSON.stringify(settings.renderer));
    };

    return { settings, updateSettings, updateRenderSettings, resetRenderSettings, saveRenderSettings };
};
