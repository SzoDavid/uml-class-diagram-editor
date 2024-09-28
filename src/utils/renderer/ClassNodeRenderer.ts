import {NodeRenderer} from './NodeRenderer.ts';
import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode} from '../umlNodes.ts';

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
            italic: node.isAbstract(),
            textAlign: 'center'
        });

        this.renderProperties(node, invalid);
        this.renderOperations(node, invalid);
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
    
    private renderProperties(node: ClassNode, isInvalid: boolean): void {
        if (node.properties.length !== 0) {
            this.drawRect(node.x, 
                          node.y + this._rc.lineHeight, 
                          node.width,
                          this._rc.lineHeight * node.properties.length, 
                          node.isSelected, 
                          isInvalid);
            node.height += this._rc.lineHeight * node.properties.length;

            node.properties.forEach((prop, i) => this.drawText(
                prop.toString(),
                node.x,
                node.y + ((+i + 1) * this._rc.lineHeight), 
                node.width, {
                    isSelected: node.isSelected,
                    isInvalid: isInvalid,
                    puc: prop.isStatic ? { prefix: prop.prefix, underlined: prop.name } : null
                }));
        }
    }
    
    private renderOperations(node: ClassNode, isInvalid: boolean): void {
        if (node.operations.length !== 0) {
            this.drawRect(node.x, 
                          node.y + (this._rc.lineHeight * (node.properties.length + 1)), 
                          node.width, 
                          this._rc.lineHeight * node.operations.length, 
                          node.isSelected,
                          isInvalid);
            node.height += this._rc.lineHeight * node.operations.length;

            node.operations.forEach((operation, i) => this.drawText(
                operation.toString(), 
                node.x,
                node.y + ((+i + 1) * this._rc.lineHeight) + (this._rc.lineHeight * node.properties.length),
                node.width, {
                    isSelected: node.isSelected,
                    isInvalid: isInvalid,
                    puc: operation.isStatic ? { prefix: operation.prefix, underlined: operation.name } : null
                }));
        }
    }
}