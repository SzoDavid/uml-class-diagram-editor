import {Node} from './nodes/Node.ts';
import {EditorConfig} from './UmlEditorService.ts';

export interface NodeData<T extends Node> {
    type: 'classifier'
    instance: T;
}

export interface ConfigData {
    type: 'editor';
    instance: EditorConfig
}
export type DataContext<T extends Node> = NodeData<T> | ConfigData | null;
export type ClickContext = 'prop' | 'operation' | 'param';