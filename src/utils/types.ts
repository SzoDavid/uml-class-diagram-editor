import {Node} from './nodes/Node.ts';
import {AddConfig} from '../services/UmlEditorService.ts';

export interface NodeData<T extends Node> {
    type: 'classifier'|'primitive'|'enumeration'|'comment'|'connection'
    instance: T;
}

export interface ConfigData {
    type: 'editor';
}

export interface AddOption {
    type: 'addOption';
    instance: AddConfig
}

export type DataContext<T extends Node> = NodeData<T> | ConfigData | AddOption | null;
export type ClickContext = 'prop' | 'operation' | 'param';

export interface ErrorContext {
    parameter: string,
    index?: number|string,
    child?: ErrorContext
}

export interface Point {
    x: number;
    y: number;
}
