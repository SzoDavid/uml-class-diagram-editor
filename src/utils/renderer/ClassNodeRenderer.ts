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

    // NOTE: optimize by caching width and line counts, and not rendering not visible nodes

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

        [...node.properties, ...node.operations].forEach(feature => {
            const featureWidth = this.calculateFeatureWidth(feature);

            if (featureWidth > node.width) node.width = featureWidth;
        });
    }

    private calculateFeatureWidth(feature: Feature): number {
        const baseWidth = this._ctx.measureText(feature.toString()).width + 2 * this._rc.lineMargin;

        if (IsMultilineFeature(feature) && feature.toMultilineString().length > 2 && baseWidth >= this._rc.separateObjectParametersWidthLimit) {
            return feature.toMultilineString().reduce((maxWidth, line) => {
                const lineWidth = this._ctx.measureText(line.text).width + 2 * this._rc.lineMargin + (line.tabbed ? this._rc.tabSize : 0);
                return Math.max(maxWidth, lineWidth);
            }, 0);
        }

        return baseWidth;
    }

    private renderFeatureGroup(features: Feature[],
                               x: number,
                               y: number,
                               width: number,
                               isSelected: boolean,
                               isInvalid: boolean,
                               showExtra: boolean): number {
        if (features.length === 0 && !showExtra) return 0;

        const totalLines = this.calculateTotalFeatureLines(features);

        this.drawRect(x, y, width,
                      this._rc.lineHeight * (totalLines + (showExtra ? 1 : 0)),
                      isSelected, isInvalid);

        this.renderFeatures(features, x, y, width, isSelected, isInvalid);

        if (!showExtra) return totalLines;

        this.drawText(
            '...',
            x,
            y + (totalLines * this._rc.lineHeight),
            width,
            {
                isSelected: isSelected,
                isInvalid: isInvalid
            }
        );

        return totalLines + 1;
    }

    private renderFeatures(features: Feature[],
                           x: number,
                           y: number,
                           width: number,
                           isSelected: boolean,
                           isInvalid: boolean) {
        features.forEach((feature, i) => {
            if (!IsMultilineFeature(feature) || feature.toMultilineString().length <= 2 ||
                this._ctx.measureText(feature.toString()).width < this._rc.separateObjectParametersWidthLimit) {
                this.drawText(
                    feature.toString(),
                    x,
                    y + (i * this._rc.lineHeight),
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
                    y + ((i + j) * this._rc.lineHeight),
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
    }

    private calculateTotalFeatureLines(features: Feature[]): number {
        return features.reduce((totalLines, feature) => {
            if (IsMultilineFeature(feature) && this._ctx.measureText(feature.toString()).width >= this._rc.separateObjectParametersWidthLimit) {
                return totalLines + feature.toMultilineString().length;
            }
            return totalLines + 1;
        }, 0);
    }
}