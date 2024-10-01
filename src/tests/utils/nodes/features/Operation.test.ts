import {describe, expect, it} from 'vitest';
import {Operation} from '../../../../utils/nodes/features/Operation';
import {Parameter} from '../../../../utils/nodes/features/Parameter';
import {MultiplicityRange} from '../../../../utils/nodes/features/MultiplicityRange';
import {Visibility} from '../../../../utils/nodes/types.ts';

describe('Operation', () => {
    const mockParams = [new Parameter('param1', 'int'), new Parameter('param2', 'string')]; // Adjust as necessary
    const mockMultiplicity = new MultiplicityRange(0, 1); // Assuming constructor accepts min and max values

    it('should create an instance with default values', () => {
        const operation = new Operation('myOperation');
        expect(operation.name).toBe('myOperation');
        expect(operation.params).toEqual([]);
        expect(operation.visibility).toBe(null);
        expect(operation.returnType).toBe(null);
        expect(operation.returnMultiplicity).toBe(null);
        expect(operation.isStatic).toBe(false);
        expect(operation.isAbstract).toBe(false);
        expect(operation.properties).toEqual([]);
        expect(operation.redefines).toBe(null);
    });

    it('should create an instance with provided values', () => {
        const operation = new Operation('myOperation', mockParams, Visibility.PUBLIC, 'void', mockMultiplicity, true, false, ['unique'], 'otherOperation');
        expect(operation.name).toBe('myOperation');
        expect(operation.params).toEqual(mockParams);
        expect(operation.visibility).toBe(Visibility.PUBLIC);
        expect(operation.returnType).toBe('void');
        expect(operation.returnMultiplicity).toBe(mockMultiplicity);
        expect(operation.isStatic).toBe(true);
        expect(operation.isAbstract).toBe(false);
        expect(operation.properties).toEqual(['unique']);
        expect(operation.redefines).toBe('otherOperation');
    });

    it('should return the correct string representation', () => {
        const operation = new Operation('myOperation', mockParams, Visibility.PUBLIC, 'void', mockMultiplicity, true, false, []);
        expect(operation.toString()).toBe('+myOperation(param1: int, param2: string): void[0..1] {}');
    });

    it('should validate correctly', () => {
        const operation = new Operation('', [], null, '', null, false, false, []);
        const errors = operation.validate();
        expect(errors).toContainEqual({ parameter: 'name', message: 'Name is required' });

        operation.name = 'validName';
        operation.returnType = 'validType';
        operation.returnMultiplicity = mockMultiplicity; // Assuming valid multiplicity
        const validErrors = operation.validate();
        expect(validErrors).toHaveLength(0);
    });

    it('should clone correctly', () => {
        const operation = new Operation('myOperation', mockParams, Visibility.PUBLIC, 'void', mockMultiplicity, true, false, []);
        const clonedOperation = operation.clone();
        expect(clonedOperation).not.toBe(operation); // Ensure they are different instances
        expect(clonedOperation).toEqual(operation); // Ensure they have the same values
    });

    it('should validate invalid static and abstract combination', () => {
        const operation = new Operation('myOperation', [], null, null, null, true, true, []);
        const errors = operation.validate();
        expect(errors).toContainEqual({ parameter: 'isAbstract', message: 'Operation cannot be both static and abstract' });
    });
});
