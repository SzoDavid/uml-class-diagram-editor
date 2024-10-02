import {ANode} from './nodes/ANode.ts';
import {EditorConfig} from './UmlEditorService.ts';

export interface NodeData<T extends ANode> {
    type: 'class';
    instance: T;
}

export interface ConfigData {
    type: 'editor';
    instance: EditorConfig
}
export type DataContext<T extends ANode> = NodeData<T> | ConfigData | null;
export type ClickContext = 'prop' | 'operation' | 'param';