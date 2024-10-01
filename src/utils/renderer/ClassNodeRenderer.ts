import {NodeRenderer} from './NodeRenderer.ts';
import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode} from '../nodes/ClassNode.ts';
import {Feature} from '../nodes/features/Feature.ts';
import {IsDecoratedFeature} from '../nodes/features/DecoratedFeature.ts';

export class ClassNodeRenderer extends NodeRenderer {
    constructor(ctx: CanvasRenderingContext2D, renderConfig: RenderConfiguration) {
        super(ctx, renderConfig);
    }

    public render(node: ClassNode): void {
        let invalid = false;
        const nodeErrors = node.validate();
        if (nodeErrors.length > 0) {
            console.error({message: 'Node is invalid', node: node, errors: nodeErrors});
            if (this._rc.showInvalidity) invalid = true;
        }

        this.adjustWidth(node);

        this.drawRect(node.x, node.y, node.width, this._rc.lineHeight, node.isSelected, invalid);
        node.height = this._rc.lineHeight;

        this.drawText(node.name, node.x, node.y, node.width, {
            isSelected: node.isSelected,
            isInvalid: invalid,
            textWeight: 'bold',
            italic: node.isAbstract,
            textAlign: 'center'
        });

        this.renderFeatureGroup(
            node.properties, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownPropertiesExist
        );
        node.height += this._rc.lineHeight * (node.properties.length + (node.isNotShownPropertiesExist ? 1 : 0));

        this.renderFeatureGroup(
            node.operations, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownOperationsExist
        );
        node.height += this._rc.lineHeight * (node.operations.length + (node.isNotShownOperationsExist ? 1 : 0));
    }

    private adjustWidth(node: ClassNode): void {
        node.width = this._rc.defaultWidth;

        this._ctx.font = `${this._rc.textSize}px Arial`;
        for (const property of node.properties) {
            const propW = this._ctx.measureText(property.toString()).width + 2 * this._rc.lineMargin;

            if (propW > node.width) node.width = propW;
        }

        for (const operation of node.operations) {
            const operationW = this._ctx.measureText(operation.toString()).width + 2 * this._rc.lineMargin;

            if (operationW > node.width) node.width = operationW;
        }
    }

    private renderFeatureGroup(features: Feature[],
                               x: number,
                               y: number,
                               width: number,
                               isSelected: boolean,
                               isInvalid: boolean,
                               showExtra: boolean): void {
        if (features.length === 0 && !showExtra) return;

        this.drawRect(x, y, width,
                      this._rc.lineHeight * (features.length + (showExtra ? 1 : 0)),
                      isSelected, isInvalid);

        features.forEach((feature, i) => this.drawText(
            feature.toString(),
            x,
            y + ((+i) * this._rc.lineHeight),
            width,
            {
                isSelected: isSelected,
                isInvalid: isInvalid,
                puc: IsDecoratedFeature(feature) && feature.decorator === 'underline' ?
                    {prefix: feature.prefix, underlined: feature.text} : null
            }));

        if (!showExtra) return;

        this.drawText(
            '...',
            x,
            y + (features.length * this._rc.lineHeight),
            width,
            {
                isSelected: isSelected,
                isInvalid: isInvalid
            }
        );
    }
}