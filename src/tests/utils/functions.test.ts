import {describe, test, expect} from 'vitest';
import {InvalidNodeParameterCause} from '../../utils/nodes/types.ts';
import {ErrorContext} from '../../utils/types.ts';
import {findError} from '../../utils/functions.ts';

describe('UCDE-findError', () => {
    test('UCDE-FE-01 GIVEN a list of errors WHEN a matching parameter and index are provided THEN returns the correct error message', () => {
        const errors: InvalidNodeParameterCause[] = [
            { parameter: 'param1', message: 'Error 1', index: 0 },
            { parameter: 'param2', message: 'Error 2', index: 1 },
        ];
        const context: ErrorContext = { parameter: 'param1', index: 0 };

        const result = findError(errors, context);

        expect(result).toBe('Error 1');
    });

    test('UCDE-FE-02 IVEN a list of errors WHEN no matching parameter is found THEN it returns an empty string', () => {
        const errors: InvalidNodeParameterCause[] = [
            { parameter: 'param1', message: 'Error 1', index: 0 },
            { parameter: 'param2', message: 'Error 2', index: 1 },
        ];
        const context: ErrorContext = { parameter: 'param3' };

        const result = findError(errors, context);

        expect(result).toBe('');
    });

    test('UCDE-FE-03 GIVEN nested error contexts WHEN a child context exists THEN it recurses and finds the correct error', () => {
        const errors: InvalidNodeParameterCause[] = [
            {
                parameter: 'param1',
                message: 'Error 1',
                context: [
                    { parameter: 'childParam', message: 'Child Error', index: 0 },
                ],
            },
        ];
        const context: ErrorContext = {
            parameter: 'param1',
            child: { parameter: 'childParam', index: 0 },
        };

        const result = findError(errors, context);

        expect(result).toBe('Child Error');
    });
});