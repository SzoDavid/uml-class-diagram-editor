import {NodeRenderer} from './NodeRenderer.ts';
import {Feature} from '../nodes/features/Feature.ts';
import {IsDecoratedFeature} from '../nodes/features/DecoratedFeature.ts';
import {IsMultilineFeature} from '../nodes/features/MultilineFeature.ts';
import {ClassifierNode} from '../nodes/ClassifierNode.ts';
import {ClassNode} from '../nodes/ClassNode.ts';
import {ClassAbstractionDisplayMode} from './RenderConfiguration.ts';

export class ClassifierNodeRenderer {
    private _nr: NodeRenderer;

    constructor(nodeRenderer: NodeRenderer) {
        this._nr = nodeRenderer;
    }

    // NOTE: optimize by caching width and line counts, and not rendering not visible nodes

    public render(node: ClassifierNode): void {
        const abstractKeyword = this._nr.rc.options.classAbstractionDisplayMode === ClassAbstractionDisplayMode.KEYWORD;

        let invalid = false;
        const nodeErrors = node.validate();
        if (nodeErrors.length > 0) {
            console.error({message: 'Node is invalid', node: node, errors: nodeErrors});
            if (this._nr.rc.showInvalidity) invalid = true;
        }

        this.adjustWidth(node);

        this._nr.drawHeader(node.x, node.y, node.width, node.name, node.header,
                            abstractKeyword && node instanceof ClassNode && node.isAbstract ? '{abstract}' : '',
                            node.isSelected, invalid, !abstractKeyword && node instanceof ClassNode && node.isAbstract);
        node.height = this._nr.rc.lineHeight * ((node.header ? 2 : 1) + (abstractKeyword && node instanceof ClassNode && node.isAbstract ? 1 : 0));

        node.height += this._nr.rc.lineHeight * this.renderFeatureGroup(
            node.properties, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownPropertiesExist
        );

        node.height += this._nr.rc.lineHeight * this.renderFeatureGroup(
            node.operations, node.x, node.y + node.height, node.width,
            node.isSelected, invalid, node.isNotShownOperationsExist
        );
    }

    private adjustWidth(node: ClassifierNode): void {
        node.width = this._nr.rc.defaultWidth;

        this._nr.ctx.font = `bold ${this._nr.rc.textSize}px Arial`;

        node.width = Math.max(
            node.width,
            this._nr.ctx.measureText(node.name).width + 2 * this._nr.rc.lineMargin,
            node.header ? this._nr.ctx.measureText(`«${node.header}»`).width + 2 * this._nr.rc.lineMargin : 0,
            this._nr.rc.options.classAbstractionDisplayMode === ClassAbstractionDisplayMode.KEYWORD && node instanceof ClassNode && node.isAbstract
                ? this._nr.ctx.measureText('{abstract}').width + 2 * this._nr.rc.lineMargin : 0
        );

        this._nr.ctx.font = `${this._nr.rc.textSize}px Arial`;

        [...node.properties, ...node.operations].forEach(feature =>
            node.width = Math.max(node.width, this.calculateFeatureWidth(feature)));
    }

    private calculateFeatureWidth(feature: Feature): number {
        const baseWidth = this._nr.ctx.measureText(feature.toString()).width + 2 * this._nr.rc.lineMargin;

        if (IsMultilineFeature(feature) && feature.toMultilineString().length > 2 && baseWidth >= this._nr.rc.separateObjectParametersWidthLimit) {
            return feature.toMultilineString().reduce((maxWidth, line) => {
                const lineWidth = this._nr.ctx.measureText(line.text).width + 2 * this._nr.rc.lineMargin + (line.tabbed ? this._nr.rc.tabSize : 0);
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

        this._nr.drawRect(x, y, width,
                          this._nr.rc.lineHeight * (totalLines + (showExtra ? 1 : 0)),
                          isSelected, isInvalid);

        this.renderFeatures(features, x, y, width, isSelected, isInvalid);

        if (!showExtra) return totalLines;

        this._nr.drawText(
            '...',
            x,
            y + (totalLines * this._nr.rc.lineHeight),
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
                this._nr.ctx.measureText(feature.toString()).width < this._nr.rc.separateObjectParametersWidthLimit) {
                this._nr.drawText(
                    feature.toString(),
                    x,
                    y + (i * this._nr.rc.lineHeight),
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
                this._nr.drawText(
                    line.text,
                    x,
                    y + ((i + j) * this._nr.rc.lineHeight),
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
            if (IsMultilineFeature(feature) && this._nr.ctx.measureText(feature.toString()).width >= this._nr.rc.separateObjectParametersWidthLimit) {
                return totalLines + feature.toMultilineString().length;
            }
            return totalLines + 1;
        }, 0);
    }
}