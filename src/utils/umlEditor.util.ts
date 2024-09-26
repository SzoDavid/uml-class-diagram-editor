import mitt, {Emitter} from 'mitt';
import {ClassNode, Node} from './umlNodes.util.ts';

export enum UmlEditorTool {
    EDIT,
    MOVE
}

export type EmitType = Node | UmlEditorTool | null;

export class UmlEditorUtil {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _nodes: Node[] = [];
    private _selectedNode: Node | null = null;
    private _dragOffsetX: number = 0;
    private _dragOffsetY: number = 0;
    private _tool: UmlEditorTool = UmlEditorTool.EDIT;

    private readonly _emitter: Emitter<Record<string, EmitType>> = mitt();

    private readonly TEXT_SIZE = 16;
    private readonly LINE_HEIGHT = 24;
    private readonly LINE_WIDTH_FILL_RATIO = 0.95;
    private readonly BORDER_SIZE = 1;
    private readonly FILL_COLOR = '#FFF';
    private readonly FILL_COLOR_SELECTED = '#FEFEFF';
    private readonly ACCENT_COLOR = '#000';
    private readonly ACCENT_COLOR_SELECTED = '#66F';

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;

        this._ctx = this._canvas.getContext('2d')!;
        this._canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this._canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.render();
    }

    public get emitter() {
        return this._emitter;
    }

    public get tool() {
        return this._tool;
    }

    public set tool(tool: UmlEditorTool) {
        this._tool = tool;
        this._emitter.emit('toolChange', tool);
    }

    render(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._nodes.forEach(node => this.drawNode(node));
    }

    addNode(node: Node): void {
        this._nodes.push(node);
        this.render();
    }

    private drawNode(node: Node): void {
        if (node instanceof ClassNode) {
            this.drawRect(node.x, node.y, node.width, this.LINE_HEIGHT, node.isSelected);
            node.height = this.LINE_HEIGHT;

            this.drawText(node.name, node.x, node.y, node.width, node.isSelected, 'center');

            if (node.properties.length !== 0) {
                this.drawRect(node.x, node.y + this.LINE_HEIGHT, node.width, this.LINE_HEIGHT * node.properties.length, node.isSelected);
                node.height += this.LINE_HEIGHT * node.properties.length;

                for (const i in node.properties) {
                    this.drawText(node.properties[i].toString(), node.x, node.y + ((+i + 1) * this.LINE_HEIGHT), node.width, node.isSelected);
                }
            }

            if (node.operations.length !== 0) {
                this.drawRect(node.x, node.y + (this.LINE_HEIGHT * (node.properties.length + 1)), node.width, this.LINE_HEIGHT * node.operations.length, node.isSelected);
                node.height += this.LINE_HEIGHT * node.operations.length;

                for (const i in node.operations) {
                    this.drawText(node.operations[i].toString(), node.x, node.y + ((+i + 1) * this.LINE_HEIGHT) + (this.LINE_HEIGHT * node.properties.length), node.width, node.isSelected);
                }
            }
        }
    }

    private onMouseDown(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        this._selectedNode = this.getNodeAtPosition(offsetX, offsetY);

        if (this._selectedNode) {
            this._nodes.forEach(node => (node.isSelected = false));
            this._selectedNode.isSelected = true;

            switch (this._tool) {
                case UmlEditorTool.EDIT:
                    this._emitter.emit('mouseDown', this._selectedNode);
                    break;
                case UmlEditorTool.MOVE:
                    this._selectedNode.isDragging = true;
                    this._dragOffsetX = offsetX - this._selectedNode.x;
                    this._dragOffsetY = offsetY - this._selectedNode.y;
                    break;
            }
        } else {
            this._nodes.forEach(node => (node.isSelected = false));
        }
        this.render();
    }

    private onMouseUp(): void {
        if (this._selectedNode) {
            this._selectedNode.isDragging = false;
            this._selectedNode = null;
        }
        this.render();
    }

    private onMouseMove(event: MouseEvent): void {
        if (this._selectedNode && this._selectedNode.isDragging) {
            const { offsetX, offsetY } = event;
            this._selectedNode.x = offsetX - this._dragOffsetX;
            this._selectedNode.y = offsetY - this._dragOffsetY;
            this.render();
        }
    }

    private getNodeAtPosition(x: number, y: number): Node | null {
        for (const node of this._nodes) {
            if (
                x >= node.x &&
                x <= node.x + node.width &&
                y >= node.y &&
                y <= node.y + node.height
            ) {
                return node;
            }
        }
        return null;
    }

    private drawRect(x: number, y: number, width: number, height: number, isSelected=false): void {
        this._ctx.beginPath();
        this._ctx.rect(x, y, width, height);

        this._ctx.fillStyle = isSelected ? this.FILL_COLOR_SELECTED : this.FILL_COLOR;
        this._ctx.fill();
        this._ctx.lineWidth = this.BORDER_SIZE;
        this._ctx.strokeStyle = isSelected ? this.ACCENT_COLOR_SELECTED : this.ACCENT_COLOR;
        this._ctx.stroke();
    }

    private drawText(text: string, x: number, y: number, width: number, isSelected=false, textAlign: CanvasTextAlign='left'): void {
        this._ctx.beginPath();
        this._ctx.fillStyle = isSelected ? this.ACCENT_COLOR_SELECTED : this.ACCENT_COLOR;
        this._ctx.font = `${this.TEXT_SIZE}px Arial`;
        this._ctx.textAlign = textAlign;
        this._ctx.textBaseline = 'middle';

        switch (textAlign) {
            case 'center':
                this._ctx.fillText(text, x + (width / 2), y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break;
            case 'left':
                this._ctx.fillText(text, x + (width * (1 - this.LINE_WIDTH_FILL_RATIO)) / 2, y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break;
            default:
                this._ctx.fillText(text, x, y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break;
        }
    }
}