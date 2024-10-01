export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

export type Direction = 'in'|'out'|'inout';
export type ParameterProperty = 'ordered'|'unordered'|'unique'|'nonunique'|'sequence';
export type OperationProperty = 'query'|'ordered'|'unique';

export interface InvalidNodeParameterCause {
    parameter: string;
    message: string;
    index?: number;
    context?: InvalidNodeParameterCause[]
}