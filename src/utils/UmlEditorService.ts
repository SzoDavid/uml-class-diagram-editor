import mitt, {Emitter} from 'mitt';
import {ANode} from './nodes/ANode.ts';
import {Renderer} from './renderer/Renderer.ts';
import {ClassNode} from './nodes/ClassNode.ts';

export enum UmlEditorTool {
    EDIT,
    MOVE,
    ADD_CLASS,
    REMOVE
}

export type EmitType = ANode | UmlEditorTool | null;

export class UmlEditorService {
    private _renderer: Renderer;
    private _nodes: ANode[] = [];
    private _selectedNode: ANode | null = null;
    private _dragOffsetX: number = 0;
    private _dragOffsetY: number = 0;
    private _tool: UmlEditorTool = UmlEditorTool.EDIT;

    private readonly _emitter: Emitter<Record<string, EmitType>> = mitt();

    constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
        this._renderer = renderer;

        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.render();
    }

    public get emitter() {
        return this._emitter;
    }

    public get selectedNode() {
        return this._selectedNode;
    }

    public get tool() {
        return this._tool;
    }

    public set tool(tool: UmlEditorTool) {
        this._tool = tool;

        if (tool !== UmlEditorTool.EDIT) {
            this._nodes.forEach(node => (node.isSelected = false));
            this.render();
        }

        this._emitter.emit('toolChange', tool);
    }

    render(): void {
        this._renderer.render(this._nodes);
    }

    addNode(node: ANode): void {
        this._nodes.push(node);
        this.render();
    }

    private onMouseDown(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        if (this._tool === UmlEditorTool.ADD_CLASS) {
            this.addNode(new ClassNode('Class', offsetX, offsetY));
        }

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
                case UmlEditorTool.REMOVE:
                    this._nodes.splice(this._nodes.indexOf(this._selectedNode), 1);
                    this._selectedNode = null;
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

    private getNodeAtPosition(x: number, y: number): ANode | null {
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
}