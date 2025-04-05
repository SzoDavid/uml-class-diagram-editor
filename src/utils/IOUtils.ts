import { saveAs } from 'file-saver';
import { useSettingsService } from '../services/SettingsService.ts';
import { SerializationRegistryService } from '../services/SerializationRegistryService.ts';
import { Node } from './nodes/Node.ts';
import { TriggerService } from '../services/TriggerService.ts';

const { settings, updateRenderSettings, saveRenderSettings } =
    useSettingsService();

export function saveFile(
    documentTag: string,
    settingsTag: string,
    fileName: string,
): boolean {
    const document = localStorage.getItem(documentTag);
    const savedSettings = localStorage.getItem(settingsTag);

    if (!document) {
        return false;
    }

    const file = {
        saveVersion: 1,
        nodes: JSON.parse(document),
        renderSettings: savedSettings
            ? JSON.parse(savedSettings)
            : settings.renderer,
    };

    saveAs(
        new Blob([JSON.stringify(file)], { type: 'text/json;charset=utf-8' }),
        fileName,
    );

    return true;
}

export function importFile(
    file: File,
    triggerService: TriggerService | undefined,
) {
    return new Promise<void>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => resolve();
        fileReader.onload = () => {
            try {
                const fileContent = JSON.parse(fileReader.result as string);

                let rawNodes;

                if (fileContent.saveVersion && fileContent.saveVersion === 1) {
                    if (fileContent.renderSettings) {
                        updateRenderSettings(fileContent.renderSettings);
                        saveRenderSettings();
                    }

                    rawNodes = fileContent.nodes;
                } else {
                    rawNodes = fileContent;
                }

                const nodes =
                    SerializationRegistryService.batchDeserialize<Node>(
                        rawNodes,
                    );
                localStorage.setItem(
                    'file',
                    JSON.stringify(nodes.map((node) => node.toSerializable())),
                );
                localStorage.setItem('name', file.name);

                triggerService?.trigger('refreshEditor', nodes);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        };

        fileReader.readAsText(file);
    });
}
