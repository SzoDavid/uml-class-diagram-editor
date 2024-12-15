import {ClassifierNode} from './ClassifierNode.ts';
import {Property} from '../features/Property.ts';
import {Operation} from '../features/Operation.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';

const CLASS_TAG = 'InterfaceNode';

export class InterfaceNode extends ClassifierNode {
    constructor(name: string,
                x: number,
                y: number,
                properties: Property[]=[],
                operations: Operation[]=[],
                isNotShownPropertiesExist: boolean=false,
                isNotShownOperationsExist: boolean=false) {
        super(name, x, y, properties, operations, isNotShownPropertiesExist, isNotShownOperationsExist);
    }

    public clone(): InterfaceNode {
        const clone = new InterfaceNode(
            this.name,
            this.x,
            this.y,
            this.properties.map(prop => prop.clone()),
            this.operations.map(operation => operation.clone()),
            this.isNotShownPropertiesExist,
            this.isNotShownOperationsExist
        );

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    public copy(node: InterfaceNode) {
        super.copy(node);
    }

    public get header(): string {
        return 'Interface';
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;

        return obj;
    }

    static fromSerializable(data: any): InterfaceNode {
        const node = new InterfaceNode(
            data.name,
            data.x,
            data.y,
            data.properties.map((prop: any) => Property.fromSerializable(prop)),
            data.operations.map((operation: any) => Operation.fromSerializable(operation)),
            data.isNotShownPropertiesExist,
            data.isNotShownOperationsExist
        );

        node.width = data.width;
        node.height = data.height;

        return node;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, InterfaceNode);
