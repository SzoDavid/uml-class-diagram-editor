import {NodeRenderer} from './NodeRenderer.ts';
import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode} from '../nodes/ClassNode.ts';
import {Feature} from '../nodes/features/Feature.ts';
import {IsDecoratedFeature} from '../nodes/features/DecoratedFeature.ts';
import {IsMultilineFeature} from '../nodes/features/MultilineFeature.ts';

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

        node.height += this._rc.lineHeight * this.renderFeatureGroup(
            node.properties, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownPropertiesExist
        );

        node.height += this._rc.lineHeight * this.renderFeatureGroup(
            node.operations, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownOperationsExist
        );
    }

    private adjustWidth(node: ClassNode): void {
        node.width = this._rc.defaultWidth;

        this._ctx.font = `${this._rc.textSize}px Arial`;
        for (const property of node.properties) {
            const propW = this._ctx.measureText(property.toString()).width + 2 * this._rc.lineMargin;

            if (propW > node.width) node.width = propW;
        }

        for (const operation of node.operations) {
            let operationW = this._ctx.measureText(operation.toString()).width + 2 * this._rc.lineMargin;

            if ((operation.toMultilineString().length <= 2 ||
                this._ctx.measureText(operation.toString()).width < this._rc.separateObjectParametersWidthLimit) &&
                operationW > node.width) {
                node.width = operationW;
                return;
            }

            operation.toMultilineString().forEach((line) => {
                operationW = this._ctx.measureText(line.text).width + 2 * this._rc.lineMargin + (line.tabbed ? this._rc.tabSize : 0);

                if (operationW > node.width) node.width = operationW;
            });
        }
    }

    private renderFeatureGroup(features: Feature[],
                               x: number,
                               y: number,
                               width: number,
                               isSelected: boolean,
                               isInvalid: boolean,
                               showExtra: boolean): number {
        if (features.length === 0 && !showExtra) return 0;

        const lines = this.countFeatureLines(features);

        this.drawRect(x, y, width,
                      this._rc.lineHeight * (lines + (showExtra ? 1 : 0)),
                      isSelected, isInvalid);

        features.forEach((feature, i) => {
            if (!IsMultilineFeature(feature) || feature.toMultilineString().length <= 2 ||
                this._ctx.measureText(feature.toString()).width < this._rc.separateObjectParametersWidthLimit) {
                this.drawText(
                    feature.toString(),
                    x,
                    y + ((+i) * this._rc.lineHeight),
                    width,
                    {
                        isSelected: isSelected,
                        isInvalid: isInvalid,
                        puc: IsDecoratedFeature(feature) && feature.decorator === 'underline' ?
                            {prefix: feature.prefix, underlined: feature.text} : null
                    });

                return;
            }

            feature.toMultilineString().forEach((line, j) => {
                this.drawText(
                    line.text,
                    x,
                    y + ((+i + j) * this._rc.lineHeight),
                    width,
                    {
                        isSelected: isSelected,
                        isInvalid: isInvalid,
                        isTabbed: line.tabbed,
                        puc: IsDecoratedFeature(feature) && feature.decorator === 'underline' && j === 0 ?
                            {prefix: feature.prefix, underlined: feature.text} : null
                    });
            });
        });

        if (!showExtra) return lines;

        this.drawText(
            '...',
            x,
            y + (lines * this._rc.lineHeight),
            width,
            {
                isSelected: isSelected,
                isInvalid: isInvalid
            }
        );

        return lines + 1;
    }

    // Note: this can be optimized if the lines with the settings are precalculated, and then width calculation can be simplified too
    private countFeatureLines(features: Feature[]): number {
        let lines = 0;
        features.forEach((feature) => {
            if (IsMultilineFeature(feature) && this._ctx.measureText(feature.toString()).width >= this._rc.separateObjectParametersWidthLimit) {
                const len = feature.toMultilineString().length;
                if (len > 2) {
                    lines += len;
                    return;
                }
                lines++;
                return;
            }
            lines++;
        });

        return lines;
    }
}