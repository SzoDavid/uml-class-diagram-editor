import {InvalidNodeParameterCause, Operation, Property} from './umlNodes.ts';

export interface ClassNodeData {
    type: 'class';
    x: number;
    y: number;
    name: string;
    properties: Property[];
    operations: Operation[];
    errors: InvalidNodeParameterCause[];
}

export type DataContext = ClassNodeData | null;
export type ClickContext = 'prop' | 'operation' | 'param';