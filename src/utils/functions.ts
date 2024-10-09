import {InvalidNodeParameterCause} from './nodes/types.ts';
import {ErrorContext} from './types.ts';

export const findError = (errors: InvalidNodeParameterCause[], context: ErrorContext): string => {
    let error;

    if (context.index !== undefined && typeof context.index === 'number') {
        error = errors.find(error =>
            error.parameter === context.parameter
            && error.index === context.index);
    } else {
        error = errors.find(error => error.parameter === context.parameter);
    }

    if (!error) return '';
    if (context.child && error.context) return findError(error.context, context.child);

    return error.message;
};
