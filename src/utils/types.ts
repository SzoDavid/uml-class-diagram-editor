import {Node} from './nodes/Node.ts';
import {AddConfig, EditorConfig} from './UmlEditorService.ts';

export interface NodeData<T extends Node> {
    type: 'classifier'
    instance: T;
}

export interface ConfigData {
    type: 'editor';
    instance: EditorConfig
}

export interface AddOption {
    type: 'addOption';
    instance: AddConfig
}

export type DataContext<T extends Node> = NodeData<T> | ConfigData | AddOption | null;
export type ClickContext = 'prop' | 'operation' | 'param';