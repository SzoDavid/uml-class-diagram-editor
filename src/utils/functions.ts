import { InvalidNodeParameterCause, PixelOffset } from './nodes/types.ts';
import { ErrorContext } from './types.ts';

export function findError(
    errors: InvalidNodeParameterCause[],
    context: ErrorContext,
): string {
    let error;

    if (context.index !== undefined && typeof context.index === 'number') {
        error = errors.find(
            (error) =>
                error.parameter === context.parameter &&
                error.index === context.index,
        );
    } else {
        error = errors.find((error) => error.parameter === context.parameter);
    }

    if (!error) return '';
    if (context.child && error.context)
        return findError(error.context, context.child);

    return error.message;
}

export function validatePixelOffset(
    value: PixelOffset,
    parameterName: string,
): InvalidNodeParameterCause[] {
    const errors: InvalidNodeParameterCause[] = [];
    if (isNaN(+value.x))
        errors.push({ parameter: 'x', message: 'error.label_offset.numeric' });
    if (isNaN(+value.y))
        errors.push({ parameter: 'y', message: 'error.label_offset.numeric' });

    return errors.length > 0
        ? [
              {
                  parameter: parameterName,
                  message: 'error.label_offset.invalid',
                  context: errors,
              },
          ]
        : [];
}

export function upsertCause(
    causes: InvalidNodeParameterCause[],
    parameter: string,
    message: string,
    newContext: InvalidNodeParameterCause[],
): void {
    const existingCause = causes.find((cause) => cause.parameter === parameter);

    if (existingCause) {
        existingCause.context = existingCause.context
            ? [...existingCause.context, ...newContext]
            : [...newContext];
    } else {
        causes.push({
            parameter: parameter,
            message: message,
            context: newContext,
        });
    }
}
