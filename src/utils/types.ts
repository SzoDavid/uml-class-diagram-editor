import {Node} from './umlNodes.ts';

export interface NodeData<T extends Node> {
    type: 'class';
    instance: T;
}

export type DataContext<T extends Node> = NodeData<T> | null;
export type ClickContext = 'prop' | 'operation' | 'param';