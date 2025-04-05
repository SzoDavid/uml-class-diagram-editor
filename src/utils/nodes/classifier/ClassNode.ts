import {Property} from '../features/Property.ts';
import {Operation} from '../features/Operation.ts';
import {ClassifierNode} from './ClassifierNode.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';

export enum ClassStereotype {
    AUXILIARY = 'Auxiliary', //TODO: validate when connections are implemented
    FOCUS = 'Focus',
    IMPLEMENTATION_CLASS = 'ImplementationClass',
    METACLASS = 'Metaclass',
    TYPE = 'Type',
    UTILITY = 'Utility'
}

const CLASS_TAG = 'ClassNode';

export class ClassNode extends ClassifierNode {
    hasAbstractFlag: boolean;
    private _stereotype?: ClassStereotype;

    constructor(name: string,
                x: number,
                y: number,
                properties: Property[]=[],
                operations: Operation[]=[],
                isNotShownPropertiesExist = false,
                isNotShownOperationsExist = false,
                isAbstract = false,
                stereotype?: ClassStereotype) {
        super(name, x, y, properties, operations, isNotShownPropertiesExist, isNotShownOperationsExist);
        this.hasAbstractFlag = isAbstract;
        this._stereotype = stereotype;
    }

    public set stereotype(value: ClassStereotype|undefined) {
        this._stereotype = value;

        if (value === ClassStereotype.UTILITY) {
            this.properties.forEach(property => property.isStatic = true);
            this.operations.forEach(operation => operation.isStatic = true);
        }
    }

    public get stereotype(): ClassStereotype|undefined {
        return this._stereotype;
    }

    public get header(): string {
        return this._stereotype ?? '';
    }

    public get isAbstract(): boolean {
        if (this.hasAbstractFlag) return true;

        for (const operation of this.operations) {
            if (operation.isAbstract) return true;
        }
        return false;
    }

    public clone(): ClassNode {
        const clone = new ClassNode(
            this.name,
            this.x,
            this.y,
            this.properties.map(prop => prop.clone()),
            this.operations.map(operation => operation.clone()),
            this.isNotShownPropertiesExist,
            this.isNotShownOperationsExist,
            this.isAbstract,
            this.stereotype
        );

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    public copy(node: ClassNode) {
        super.copy(node);
        this.hasAbstractFlag = node.isAbstract;
        this.stereotype = node.stereotype;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;
        obj['isAbstract'] = this.isAbstract;
        obj['stereotype'] = this.stereotype;

        return obj;
    }

    static fromSerializable(data: any): ClassNode {
        const classNode = new ClassNode(
            data.name,
            data.x,
            data.y,
            data.properties.map((prop: any) => Property.fromSerializable(prop)),
            data.operations.map((operation: any) => Operation.fromSerializable(operation)),
            data.isNotShownPropertiesExist,
            data.isNotShownOperationsExist,
            data.isAbstract,
            data.stereotype
        );

        classNode.width = data.width;
        classNode.height = data.height;

        return classNode;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, ClassNode);
