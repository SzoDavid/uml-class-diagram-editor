import { InvalidNodeParameterCause } from './types.ts';
import { Serializable } from './Serializable.ts';

export abstract class Node implements Serializable {
    isSelected = false;
    isDragging = false;

    abstract validate(): InvalidNodeParameterCause[];
    abstract clone(): Node;
    abstract copy(node: Node): void;
    abstract containsDot(x: number, y: number): boolean;
    abstract toSerializable(): object;

    deselect(): void {
        this.isSelected = false;
    }
}
