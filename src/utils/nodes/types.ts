export enum Visibility {
    PRIVATE='-',
    PUBLIC='+',
    PROTECTED='#',
    PACKAGE='~'
}

export type Direction = 'in'|'out'|'inout';
export type ParameterProperty = 'ordered'|'unordered'|'unique'|'nonunique'|'sequence';
export type OperationProperty = 'query'|'ordered'|'unique';
export type PropertyModifier = 'id'|'readonly'|'ordered'|'unique'|'nonunique'|'sequence'|'union';

export interface InvalidNodeParameterCause {
    parameter: string;
    message: string;
    index?: number;
    context?: InvalidNodeParameterCause[]
}

export interface PixelOffset {
    x: number;
    y: number;
}

export enum NodeType {
    CLASS,
    INTERFACE,
    DATATYPE,
    PRIMITIVE,
    ENUMERATION,
    COMMENT,
    AGGREGATION,
    ASSOCIATION,
    COMPOSITION,
    GENERALIZATION
}

export enum AssociationNavigability {
    UNSPECIFIED,
    NAVIGABLE,
    UNNAVIGABLE
}