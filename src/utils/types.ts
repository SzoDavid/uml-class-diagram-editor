import {Operation, Property} from './umlNodes.ts';

export interface ClassNodeData {
    type: 'class';
    x: number;
    y: number;
    name: string;
    properties: Property[];
    operations: Operation[];
}

export type DataContext = ClassNodeData | null;
export type ClickContext = 'prop' | 'operation' | 'param';