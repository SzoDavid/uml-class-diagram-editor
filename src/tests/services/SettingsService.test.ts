import {describe, expect, test} from 'vitest';
import {ClassAbstractionDisplayMode, RenderConfiguration} from '../../utils/renderer/RenderConfiguration.ts';
import {useSettingsService} from '../../services/SettingsService.ts';

describe('UCDE-SettingsService', () => {
    test('UCDE-SS-01 GIVEN default settings WHEN the settings are initialized THEN they should have the correct default values', () => {
        const { settings } = useSettingsService();
        const defaultConfig: RenderConfiguration = {
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
            dotSize: 5,
            options: {
                classAbstractionDisplayMode: ClassAbstractionDisplayMode.ITALIC
            }
        };

        expect(settings.renderer).toEqual(defaultConfig);
    });

    test('UCDE-SS-02 GIVEN default settings WHEN updateSettings is called THEN the settings should be updated correctly', () => {
        const { settings, updateSettings } = useSettingsService();

        const newSettings = JSON.parse(JSON.stringify(settings));
        newSettings.renderer.textSize = 20;

        updateSettings(newSettings);

        expect(settings.renderer.textSize).toBe(20); // Updated value
        expect(settings.renderer.defaultWidth).toBe(100); // Unchanged default value
    });
});