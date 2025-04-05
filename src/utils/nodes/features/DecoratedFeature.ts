import { Feature } from './Feature.ts';

export type Decorator = 'underline' | 'none';

export interface DecoratedFeature extends Feature {
    get prefix(): string;
    get text(): string;
    get postfix(): string;
    get decorator(): Decorator;
}

export const IsDecoratedFeature = (
    feature: Feature,
): feature is DecoratedFeature => {
    return (
        'prefix' in feature &&
        'text' in feature &&
        'postfix' in feature &&
        'decorator' in feature
    );
};
