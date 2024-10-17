import mitt, {Emitter} from 'mitt';
import {Node} from '../utils/nodes/Node.ts';
import {Renderer} from '../utils/renderer/Renderer.ts';
import {ClassNode} from '../utils/nodes/classifier/ClassNode.ts';
import {InterfaceNode} from '../utils/nodes/classifier/InterfaceNode.ts';
import {DataTypeNode} from '../utils/nodes/classifier/DataTypeNode.ts';
import {NodeType} from '../utils/nodes/types.ts';
import {PrimitiveTypeNode} from '../utils/nodes/PrimitiveTypeNode.ts';
import {EnumerationNode} from '../utils/nodes/EnumerationNode.ts';
import {CommentNode} from '../utils/nodes/CommentNode.ts';
import {PositionalNode} from '../utils/nodes/PositionalNode.ts';
import {Connection} from '../utils/nodes/connection/Connection.ts';
import {ConnectionPart} from '../utils/nodes/connection/ConnectionPart.ts';

export enum UmlEditorTool {
    EDIT,
    MOVE,
    ADD,
    REMOVE
}

export type EmitReason = 'toolChange'|'scaleChange'|'mouseDown';
export type EmitType = Node | UmlEditorTool | number | null;

export interface EditorConfig {
    gridSize: number;
}

export interface AddConfig {
    type: NodeType;
    keepAdding: boolean
}

export class UmlEditorService {
    private _renderer: Renderer;
    private _nodes: Node[] = [];
    private _selectedNode: Node | null = null;
    private _tool: UmlEditorTool = UmlEditorTool.EDIT;

    private readonly _emitter: Emitter<Record<EmitReason, EmitType>> = mitt();

    private _dragOffsetX: number = 0;
    private _dragOffsetY: number = 0;

    private _secondaryDragOffsetX: number = 0;
    private _secondaryDragOffsetY: number = 0;

    private _scale: number = 1;
    private _isPanning: boolean = false;
    private _panOffsetX: number = 0;
    private _panOffsetY: number = 0;
    private _lastPanX: number = 0;
    private _lastPanY: number = 0;

    editorConfig: EditorConfig = {
        gridSize: 0
    };

    addConfig: AddConfig = {
        type: NodeType.CLASS,
        keepAdding: false
    };

    constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
        this._renderer = renderer;

        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('wheel', this.onMouseWheel.bind(this));

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
            this.deselectAll();
            this.render();
        }

        this._emitter.emit('toolChange', tool);
    }

    public set scale(scale: number) {
        this._scale = Math.max(scale, 0.1);
        this.emitter.emit('scaleChange', this._scale);
    }

    public get scale() {
        return this._scale;
    }

    public get offset(): {x: number, y: number} {
        return {x: this._panOffsetX, y: this._panOffsetY};
    }

    public render(): void {
        this._renderer.render(this._nodes, this._scale, this._panOffsetX, this._panOffsetY);
    }

    public addNode(node: Node): void {
        this._nodes.push(node);
        this.render();
    }

    public resetScaling(): void {
        this._scale = 1;
        this._panOffsetX = 0;
        this._panOffsetY = 0;

        this._emitter.emit('scaleChange', this._scale);

        this.render();
    }

    private onMouseDown(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        if (this._tool === UmlEditorTool.ADD) {
            let node: Node;
            switch (this.addConfig.type) {
                case NodeType.CLASS:
                    node = new ClassNode('Class', (offsetX - this._panOffsetX) / this._scale,
                                         (offsetY - this._panOffsetY) / this._scale);
                    break;
                case NodeType.INTERFACE:
                    node = new InterfaceNode('Interface', (offsetX - this._panOffsetX) / this._scale,
                                             (offsetY - this._panOffsetY) / this._scale);
                    break;
                case NodeType.DATATYPE:
                    node = new DataTypeNode('DataType', (offsetX - this._panOffsetX) / this._scale,
                                            (offsetY - this._panOffsetY) / this._scale);
                    break;
                case NodeType.PRIMITIVE:
                    node = new PrimitiveTypeNode('Primitive', (offsetX - this._panOffsetX) / this._scale,
                                                 (offsetY - this._panOffsetY) / this._scale);
                    break;
                case NodeType.ENUMERATION:
                    node = new EnumerationNode('Enumeration', (offsetX - this._panOffsetX) / this._scale,
                                               (offsetY - this._panOffsetY) / this._scale);
                    break;
                case NodeType.COMMENT:
                    node = new CommentNode('...', (offsetX - this._panOffsetX) / this._scale,
                                           (offsetY - this._panOffsetY) / this._scale);
                    break;
            }

            this.addNode(node);

            if (!this.addConfig.keepAdding) {
                this.tool = UmlEditorTool.EDIT;
            }

            return;
        }

        this._selectedNode = this.getNodeAtPosition(offsetX, offsetY);

        if (this._tool === UmlEditorTool.EDIT)
            this._emitter.emit('mouseDown', this._selectedNode);

        if (this._selectedNode) {
            this.deselectAll();
            this._selectedNode.isSelected = true;

            switch (this._tool) {
                case UmlEditorTool.MOVE:
                    if (this._selectedNode instanceof PositionalNode) { // TODO: implement for non-positional nodes
                        this._selectedNode.isDragging = true;
                        this._dragOffsetX = offsetX / this._scale - this._selectedNode.x;
                        this._dragOffsetY = offsetY / this._scale - this._selectedNode.y;
                    }
                    if (this._selectedNode instanceof ConnectionPart) {
                        this._selectedNode.isDragging = true;
                        this._dragOffsetX = offsetX / this._scale - this._selectedNode.startPoint.x;
                        this._dragOffsetY = offsetY / this._scale - this._selectedNode.startPoint.y;
                        this._secondaryDragOffsetX = offsetX / this._scale - this._selectedNode.endPoint.x;
                        this._secondaryDragOffsetY = offsetY / this._scale - this._selectedNode.endPoint.y;
                    }
                    break;
                case UmlEditorTool.REMOVE:
                    this._nodes.splice(this._nodes.indexOf(this._selectedNode), 1);
                    this._selectedNode = null;
                    break;
            }
        } else {
            this.deselectAll();
            this._isPanning = true;
            this._lastPanX = offsetX;
            this._lastPanY = offsetY;
            return;
        }
        this.render();
    }

    private onMouseUp(): void {
        this._isPanning = false;

        if (this._selectedNode) {
            this._selectedNode.isDragging = false;
            this.render();
        }
    }

    private onMouseMove(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        if (this._tool === UmlEditorTool.MOVE && this._selectedNode && this._selectedNode.isDragging) {
            if (this._selectedNode instanceof PositionalNode) {
                this._selectedNode.x = this.roundToNearest(offsetX / this._scale - this._dragOffsetX, this.editorConfig.gridSize);
                this._selectedNode.y = this.roundToNearest(offsetY / this._scale - this._dragOffsetY, this.editorConfig.gridSize);
            } else if (this._selectedNode instanceof ConnectionPart) {
                this._selectedNode.startPoint.x = this.roundToNearest(offsetX / this._scale - this._dragOffsetX, this.editorConfig.gridSize);
                this._selectedNode.startPoint.y = this.roundToNearest(offsetY / this._scale - this._dragOffsetY, this.editorConfig.gridSize);
                this._selectedNode.endPoint.x = this.roundToNearest(offsetX / this._scale - this._secondaryDragOffsetX, this.editorConfig.gridSize);
                this._selectedNode.endPoint.y = this.roundToNearest(offsetY / this._scale - this._secondaryDragOffsetY, this.editorConfig.gridSize);
            }
            this.render();
            return;
        }

        if (this._isPanning) {
            this._panOffsetX += offsetX - this._lastPanX;
            this._panOffsetY += offsetY - this._lastPanY;
            this._lastPanX = offsetX;
            this._lastPanY = offsetY;
            this.render();
        }
    }

    private onMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        const zoomFactor = 0.1;

        const zoomChange = event.deltaY < 0 ? zoomFactor : -zoomFactor;
        let newZoomLevel = this._scale + zoomChange;

        if (newZoomLevel < 0.1) {
            newZoomLevel = 0.1;
        }

        const { offsetX, offsetY } = event;

        const worldX = (offsetX - this._panOffsetX) / this._scale;
        const worldY = (offsetY - this._panOffsetY) / this._scale;

        this._panOffsetX -= (worldX * (newZoomLevel - this._scale));
        this._panOffsetY -= (worldY * (newZoomLevel - this._scale));

        this._scale = newZoomLevel;
        this._emitter.emit('scaleChange', this._scale);

        this.render();
    }

    private getNodeAtPosition(x: number, y: number): Node | null {
        const transformedX = (x - this._panOffsetX) / this._scale;
        const transformedY = (y - this._panOffsetY) / this._scale;

        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];

            if (!(node instanceof Connection)) {
                if (node.containsDot(transformedX, transformedY)) {
                    return node;
                }

                continue;
            }

            for (const part of node.parts) {
                if (part.startPoint.containsDot(transformedX, transformedY)) {
                    if (this._tool !== UmlEditorTool.MOVE && part.startPoint.isSelected) return node;
                    return part.startPoint;
                }

                if (part.endPoint.containsDot(transformedX, transformedY)) {
                    if (this._tool !== UmlEditorTool.MOVE && part.endPoint.isSelected) return node;
                    return part.endPoint;
                }

                if (part.containsDot(transformedX, transformedY)) {
                    if (this._tool !== UmlEditorTool.MOVE && part.isSelected) return node;
                    return part;
                }
            }
        }
        return null;
    }

    private roundToNearest(value: number, size: number): number {
        if (size === 0) return value;
        return Math.round(value / size) * size;
    }

    private deselectAll() {
        this._nodes.forEach(node => {
            node.isSelected = false;

            if (node instanceof Connection) {
                node.parts[0].startPoint.isSelected = false;
                node.parts.forEach(part => {
                    part.isSelected = false;
                    part.endPoint.isSelected = false;
                });
            }
        });
    }
}