/**
 * This code is responsible for managing the state of nodes on the canvas
 */
import mitt, { Emitter } from 'mitt';
import { Node } from '../utils/nodes/Node.ts';
import { Renderer } from './renderer/Renderer.ts';
import { ClassNode } from '../utils/nodes/classifier/ClassNode.ts';
import { InterfaceNode } from '../utils/nodes/classifier/InterfaceNode.ts';
import { DataTypeNode } from '../utils/nodes/classifier/DataTypeNode.ts';
import { NodeType } from '../utils/nodes/types.ts';
import { PrimitiveTypeNode } from '../utils/nodes/PrimitiveTypeNode.ts';
import { EnumerationNode } from '../utils/nodes/EnumerationNode.ts';
import { CommentNode } from '../utils/nodes/CommentNode.ts';
import { PositionalNode } from '../utils/nodes/PositionalNode.ts';
import { Connection } from '../utils/nodes/connection/Connection.ts';
import { ConnectionPart } from '../utils/nodes/connection/ConnectionPart.ts';
import { EditorConstants } from '../utils/constants.ts';
import { Point } from '../utils/types.ts';
import {
    BasicConnectionPoint,
    LooseConnectionPoint,
} from '../utils/nodes/connection/ConnectionPoint.ts';
import { Generalization } from '../utils/nodes/connection/Generalization.ts';
import { Association } from '../utils/nodes/connection/Association.ts';
import { Aggregation } from '../utils/nodes/connection/Aggregation.ts';
import { Composition } from '../utils/nodes/connection/Composition.ts';

export enum UmlEditorTool {
    EDIT,
    MOVE,
    ADD,
    REMOVE,
}

export type EmitReason = 'toolChange' | 'scaleChange' | 'mouseDown';
export type EmitType = Node | UmlEditorTool | number | null;

export interface AddConfig {
    type: NodeType;
    keepAdding: boolean;
}

export class UmlEditorService {
    private _renderer: Renderer;
    private _nodes: Node[] = [];
    private _selectedNode: Node | null = null;
    private _tool: UmlEditorTool = UmlEditorTool.EDIT;

    private readonly _emitter: Emitter<Record<EmitReason, EmitType>> = mitt();

    private _isAddingConnection = false;

    private _dragOffsetX = 0;
    private _dragOffsetY = 0;

    private _secondaryDragOffsetX = 0;
    private _secondaryDragOffsetY = 0;

    private _scale = 1;
    private _isPanning = false;
    private _panOffsetX = 0;
    private _panOffsetY = 0;
    private _lastPanX = 0;
    private _lastPanY = 0;

    addConfig: AddConfig = {
        type: NodeType.CLASS,
        keepAdding: false,
    };

    constructor(
        canvas: HTMLCanvasElement,
        renderer: Renderer,
        private virtual = false,
    ) {
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
        }

        this._emitter.emit('toolChange', tool);
    }

    public set scale(scale: number) {
        this._scale = Math.max(scale, 0.1);
        this.emitter.emit('scaleChange', this._scale);
        this.render();
    }

    public get scale() {
        return this._scale;
    }

    public get offset(): { x: number; y: number } {
        return { x: this._panOffsetX, y: this._panOffsetY };
    }

    public set nodes(nodes: Node[]) {
        this._nodes = nodes;
        this.render();
    }

    public render(): void {
        // If adding a connection is in progress, render its ghost
        if (this._isAddingConnection) {
            this._renderer.render(
                this._nodes,
                this._scale,
                this._panOffsetX,
                this._panOffsetY,
                {
                    start: { x: this._dragOffsetX, y: this._dragOffsetY },
                    end: {
                        x: this._secondaryDragOffsetX,
                        y: this._secondaryDragOffsetY,
                    },
                },
            );
            return;
        }

        this._renderer.render(
            this._nodes,
            this._scale,
            this._panOffsetX,
            this._panOffsetY,
        );

        this.saveChangesToLocalStorage();
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

    /**
     * Handles the `mousedown` event on the diagram editor's canvas.
     *
     * Depending on the current tool selected in the editor, this method performs
     * different actions:
     *
     * - **ADD Tool**: Adds a new node at the mouse click position.
     * - **EDIT Tool**: Emits a 'mouseDown' event with the selected node, allowing for custom edits.
     * - **MOVE Tool**: Initiates moving the selected node.
     * - **REMOVE Tool**: Removes the selected node from the diagram.
     *
     * If no node is selected (i.e., the click does not hit any existing node), the method
     * initiates panning mode, allowing the canvas to move based on mouse dragging.
     *
     * @param event - The `MouseEvent` object containing the click information,
     *                specifically the `offsetX` and `offsetY` (coordinates relative to the canvas).
     */
    private onMouseDown(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        switch (this._tool) {
            case UmlEditorTool.ADD:
                this.handleAddNode(offsetX, offsetY);
                break;
            case UmlEditorTool.EDIT:
                this._selectedNode = this.getNodeAtPosition(offsetX, offsetY);
                this.deselectAll();

                if (this._selectedNode) {
                    this._selectedNode.isSelected = true;
                } else {
                    this.handlePanning(offsetX, offsetY);
                }

                this._emitter.emit('mouseDown', this._selectedNode);
                break;
            case UmlEditorTool.MOVE:
                this._selectedNode = this.getNodeAtPositionForMoving(
                    offsetX,
                    offsetY,
                );

                if (this._selectedNode) {
                    this.deselectAll();
                    this._selectedNode.isSelected = true;
                    this.handleMoveNode(offsetX, offsetY);
                } else {
                    this.handlePanning(offsetX, offsetY);
                }
                break;
            case UmlEditorTool.REMOVE:
                if (this.handleRemove(offsetX, offsetY)) {
                    this.deselectAll();
                    this._selectedNode = null;
                } else {
                    this.handlePanning(offsetX, offsetY);
                }
                break;
        }

        this.render();
    }

    private onMouseUp(event: MouseEvent): void {
        const { offsetX, offsetY } = event;
        this._isPanning = false;

        if (this._isAddingConnection) {
            this._isAddingConnection = false;

            // Only add connection if its length is larger than the given constant
            if (
                Math.abs(
                    Math.sqrt(
                        Math.pow(
                            this._secondaryDragOffsetX - this._dragOffsetX,
                            2,
                        ) +
                            Math.pow(
                                this._secondaryDragOffsetY - this._dragOffsetY,
                                2,
                            ),
                    ),
                ) > EditorConstants.minConnectionLength
            ) {
                const nodeAtStart = this.getNodeAtPosition(
                    this._dragOffsetX,
                    this._dragOffsetY,
                );
                const nodeAtEnd = this.getNodeAtPosition(
                    this._secondaryDragOffsetX,
                    this._secondaryDragOffsetY,
                );

                const startPoint: PositionalNode | Point =
                    nodeAtStart instanceof PositionalNode
                        ? nodeAtStart
                        : { x: this._dragOffsetX, y: this._dragOffsetY };
                const endPoint: PositionalNode | Point =
                    nodeAtEnd instanceof PositionalNode
                        ? nodeAtEnd
                        : {
                              x: this._secondaryDragOffsetX,
                              y: this._secondaryDragOffsetY,
                          };

                switch (this.addConfig.type) {
                    case NodeType.AGGREGATION:
                        this.addNode(new Aggregation([startPoint, endPoint]));
                        break;
                    case NodeType.ASSOCIATION:
                        this.addNode(new Association([startPoint, endPoint]));
                        break;
                    case NodeType.COMPOSITION:
                        this.addNode(new Composition([startPoint, endPoint]));
                        break;
                    case NodeType.GENERALIZATION:
                        this.addNode(
                            new Generalization([startPoint, endPoint]),
                        );
                        break;
                    default:
                        console.error(
                            'trying to add a connection but type selected is not one',
                        );
                }

                if (!this.addConfig.keepAdding) {
                    this.tool = UmlEditorTool.EDIT;
                }
            }
        } else if (this._selectedNode) {
            this._selectedNode.isDragging = false;

            if (
                this._selectedNode instanceof BasicConnectionPoint &&
                (this._selectedNode.isStartPoint ||
                    this._selectedNode.isEndpoint)
            ) {
                const nodeAtPosition = this.getNodeAtPosition(
                    offsetX,
                    offsetY,
                    true,
                );

                if (nodeAtPosition instanceof PositionalNode) {
                    this._selectedNode =
                        this._selectedNode.convertToLoosePoint(nodeAtPosition);
                }
            }
        }

        this.render();
    }

    /**
     * Handles the `mousemove` event on the diagram editor's canvas.
     *
     * This method is primarily responsible for three actions:
     *
     * 1. **Move a selected node**: If the editor is in the MOVE tool mode and a node
     *    is selected, the node will be moved to follow the mouse position.
     *    - The node's position is updated based on grid alignment and scaling.
     *    - For `PositionalNode` types, the X and Y coordinates of the node are adjusted.
     *    - For `ConnectionPart` types, both the start and end points are adjusted to follow the mouse.
     *
     * 3. **Drag connection line ghost**: Adjusts the end coordinates of the connection ghost
     *    until the `mouseup` event.
     *
     * 2. **Pan the canvas**: If panning mode is active (i.e., the user is dragging the canvas),
     *    the viewport will be updated to follow the mouse movement, allowing the user to navigate the canvas.
     *
     * @param event - The `MouseEvent` object containing the mouse's current position,
     *                specifically `offsetX` and `offsetY` (coordinates relative to the canvas).
     */
    private onMouseMove(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        const gridSize = this._renderer.renderConfiguration.options.gridSize;

        if (this._selectedNode && this._selectedNode.isDragging) {
            if (this._selectedNode instanceof PositionalNode) {
                this._selectedNode.x = this.roundToNearest(
                    offsetX / this._scale - this._dragOffsetX,
                    gridSize,
                );
                this._selectedNode.y = this.roundToNearest(
                    offsetY / this._scale - this._dragOffsetY,
                    gridSize,
                );
            } else if (this._selectedNode instanceof ConnectionPart) {
                if (
                    !(
                        this._selectedNode.startPoint instanceof
                        LooseConnectionPoint
                    )
                ) {
                    this._selectedNode.startPoint.x = this.roundToNearest(
                        offsetX / this._scale - this._dragOffsetX,
                        gridSize,
                    );
                    this._selectedNode.startPoint.y = this.roundToNearest(
                        offsetY / this._scale - this._dragOffsetY,
                        gridSize,
                    );
                }
                if (
                    !(
                        this._selectedNode.endPoint instanceof
                        LooseConnectionPoint
                    )
                ) {
                    this._selectedNode.endPoint.x = this.roundToNearest(
                        offsetX / this._scale - this._secondaryDragOffsetX,
                        gridSize,
                    );
                    this._selectedNode.endPoint.y = this.roundToNearest(
                        offsetY / this._scale - this._secondaryDragOffsetY,
                        gridSize,
                    );
                }
            }
            this.render();
            return;
        }

        if (this._isAddingConnection) {
            this._secondaryDragOffsetX = this.roundToNearest(
                (offsetX - this._panOffsetX) / this._scale,
                gridSize,
            );
            this._secondaryDragOffsetY = this.roundToNearest(
                (offsetY - this._panOffsetY) / this._scale,
                gridSize,
            );
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

    /**
     * Handles the mouse wheel event to zoom in or out of the diagram.
     *
     * This method adjusts the zoom level of the editor based on the direction of the mouse wheel scroll.
     * It updates the scale factor, recalculates the pan offsets to maintain the point under the cursor,
     * and emits a scale change event.
     *
     * **Key Behaviors:**
     *
     * 1. **Zoom Factor**:
     *    - The method defines a constant zoom factor (0.1) which determines how much the zoom level changes
     *      with each scroll.
     *
     * 2. **Zoom Direction**:
     *    - The zoom level is increased (zoom in) if the `deltaY` property of the event is negative, indicating
     *      an upward scroll. Conversely, it is decreased (zoom out) for a positive `deltaY`.
     *
     * 3. **Limit Zoom Level**:
     *    - The new zoom level is constrained to a minimum value of 0.1 to prevent excessive zooming out.
     *
     * 4. **Pan Adjustment**:
     *    - The method calculates the world coordinates based on the mouse position and the current pan and scale.
     *    - The pan offsets are adjusted to keep the point under the cursor stationary during zooming.
     *
     * 5. **Emit Scale Change**:
     *    - The method emits a 'scaleChange' event through the emitter to notify other components of the new scale.
     *
     * 6. **Render Update**:
     *    - Finally, it triggers a re-render of the diagram to reflect the updated zoom level.
     *
     * @param event - The wheel event containing information about the scroll direction and distance.
     */
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

        this._panOffsetX -= worldX * (newZoomLevel - this._scale);
        this._panOffsetY -= worldY * (newZoomLevel - this._scale);

        this._scale = newZoomLevel;
        this._emitter.emit('scaleChange', this._scale);

        this.render();
    }

    /**
     * Handles the addition of a new node to the UML diagram at the specified coordinates.
     *
     * This method creates a new node of the type specified in the `addConfig` configuration object.
     * It transforms the given x and y coordinates based on the current pan offset and scale,
     * instantiates the appropriate node type, and adds it to the diagram.
     * If configured, it can switch the current tool back to the edit mode after adding a node.
     * When adding a connection, it only starts a process which will end with a `mouseup` event.
     *
     * **Key Behaviors:**
     *
     * 1. **Coordinate Transformation**:
     *    - The method transforms the x and y coordinates from screen space to world space by adjusting
     *      for the current pan offset and scale.
     *
     * 2. **Node Creation**:
     *    - Depending on the node type specified in `this.addConfig.type`, it instantiates one of the following
     *      node types: `ClassNode`, `InterfaceNode`, `DataTypeNode`, `PrimitiveTypeNode`, `EnumerationNode`, or `CommentNode`.
     *
     * 3. **Start drawing connection**:
     *    - Saves the click coordinates where the connection will begin from.
     *
     * 4. **Node Addition**:
     *    - After creating the node, it calls the `addNode` method to add it to the diagram's node collection.
     *
     * 5. **Tool State Management**:
     *    - If `this.addConfig.keepAdding` is false, it switches the current tool to `UmlEditorTool.EDIT`,
     *      allowing for subsequent editing actions instead of continuous node addition.
     *
     * @param x - The x-coordinate (in screen space) where the node should be added.
     * @param y - The y-coordinate (in screen space) where the node should be added.
     */
    private handleAddNode(x: number, y: number): void {
        const transformedX = this.roundToNearest(
            (x - this._panOffsetX) / this._scale,
            this._renderer.renderConfiguration.options.gridSize,
        );
        const transformedY = this.roundToNearest(
            (y - this._panOffsetY) / this._scale,
            this._renderer.renderConfiguration.options.gridSize,
        );

        let node: Node;
        switch (this.addConfig.type) {
            case NodeType.CLASS:
                node = new ClassNode('Class', transformedX, transformedY);
                break;
            case NodeType.INTERFACE:
                node = new InterfaceNode(
                    'Interface',
                    transformedX,
                    transformedY,
                );
                break;
            case NodeType.DATATYPE:
                node = new DataTypeNode('DataType', transformedX, transformedY);
                break;
            case NodeType.PRIMITIVE:
                node = new PrimitiveTypeNode(
                    'Primitive',
                    transformedX,
                    transformedY,
                );
                break;
            case NodeType.ENUMERATION:
                node = new EnumerationNode(
                    'Enumeration',
                    transformedX,
                    transformedY,
                );
                break;
            case NodeType.COMMENT:
                node = new CommentNode('...', transformedX, transformedY);
                break;
            case NodeType.AGGREGATION:
            case NodeType.ASSOCIATION:
            case NodeType.COMPOSITION:
            case NodeType.GENERALIZATION:
                this._isAddingConnection = true;
                this._dragOffsetX = transformedX;
                this._dragOffsetY = transformedY;
                this._secondaryDragOffsetX = transformedX;
                this._secondaryDragOffsetY = transformedY;
                return;
        }

        this.addNode(node);

        if (!this.addConfig.keepAdding) {
            this.tool = UmlEditorTool.EDIT;
        }
    }

    /**
     * Handles starting the movement of the currently selected node in the UML diagram.
     *
     * This method calculates the transformed coordinates based on the provided x and y
     * values and updates the dragging state and offsets for the selected node, allowing it
     * to be moved interactively within the diagram.
     * It supports both `PositionalNode` types and `ConnectionPart` types, applying the
     * appropriate logic based on the node's class.
     *
     * **Key Behaviors:**
     *
     * 1. **Coordinate Transformation**:
     *    - The method transforms the provided x and y coordinates from screen space to world
     *      coordinates using the current scale. This ensures the movement calculations are
     *      accurate relative to the diagram's coordinate system.
     * 3. **Converting `LooseConnectionPoint` if necessary**:
     *    - When moving a `LooseConnectionPoint`, it first needs to be converted into a
     *      `BasicConnectionPoint`, to stop it from snapping to a `PositionalNode`.
     * 2. **Dragging State Management**:
     *    - If the currently selected node is an instance of `PositionalNode`, it sets the
     *      `isDragging` property to `true` and calculates the offsets required to adjust the
     *      node's position during movement.
     *    - For `ConnectionPart` instances, the method similarly sets the `isDragging` property
     *      and calculates offsets for both the start and end points of the connection.
     *
     * @param x - The x-coordinate (in screen space) to move the selected node.
     * @param y - The y-coordinate (in screen space) to move the selected node.
     */
    private handleMoveNode(x: number, y: number): void {
        const transformedX = x / this._scale;
        const transformedY = y / this._scale;

        if (this._selectedNode instanceof LooseConnectionPoint) {
            this._selectedNode = this._selectedNode.convertToBasicPoint(
                this._selectedNode.x,
                this._selectedNode.y,
            );
        }

        if (this._selectedNode instanceof PositionalNode) {
            this._selectedNode.isDragging = true;
            this._dragOffsetX = transformedX - this._selectedNode.x;
            this._dragOffsetY = transformedY - this._selectedNode.y;
        } else if (this._selectedNode instanceof ConnectionPart) {
            this._selectedNode.isDragging = true;
            this._dragOffsetX = transformedX - this._selectedNode.startPoint.x;
            this._dragOffsetY = transformedY - this._selectedNode.startPoint.y;
            this._secondaryDragOffsetX =
                transformedX - this._selectedNode.endPoint.x;
            this._secondaryDragOffsetY =
                transformedY - this._selectedNode.endPoint.y;
        }
    }

    private handleRemove(x: number, y: number): boolean {
        const transformedX = (x - this._panOffsetX) / this._scale;
        const transformedY = (y - this._panOffsetY) / this._scale;

        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];

            if (!(node instanceof Connection)) {
                if (node.containsDot(transformedX, transformedY)) {
                    this._nodes.splice(i, 1);
                    return true;
                }
                continue;
            }

            for (const part of node.parts) {
                if (part.startPoint.containsDot(transformedX, transformedY)) {
                    part.startPoint.remove();
                    if (node.parts.length === 0) this._nodes.splice(i, 1);
                    return true;
                }

                if (part.endPoint.containsDot(transformedX, transformedY)) {
                    part.endPoint.remove();
                    if (node.parts.length === 0) this._nodes.splice(i, 1);
                    return true;
                }

                if (part.containsDot(transformedX, transformedY)) {
                    part.remove();
                    if (node.parts.length === 0) this._nodes.splice(i, 1);
                    return true;
                }
            }
        }

        return false;
    }

    private handlePanning(x: number, y: number): void {
        this.deselectAll();
        this._isPanning = true;
        this._lastPanX = x;
        this._lastPanY = y;
    }

    /**
     * Retrieves the node or connection part at the specified canvas coordinates.
     *
     * This method identifies which node or part of a connection is under the given
     * mouse coordinates. The coordinates are first transformed to account for
     * panning and scaling, and then checked against each node in reverse rendering order
     * (from top to bottom).
     *
     * **Key Behaviors:**
     *
     * 1. **Positional Nodes**:
     *    - For regular nodes (that are not connections), it checks if the given transformed
     *      coordinates fall within the node's boundaries using the `containsDot` method.
     *
     * 2. **Connection Nodes**:
     *    - For nodes that represent connections, it checks each part of the connection:
     *      - First, it checks if the start point or end point of the connection contains the
     *        given coordinates.
     *      - If no start or end point contains the coordinates, it checks the lines between these points.
     *      - If the start or end point or the line is already selected,
     *        the whole connection is returned.
     *
     * The method returns the first matching node or connection part it finds, or `null`
     * if no node or part is found at the given coordinates.
     *
     * @param x - The X-coordinate of the mouse event, relative to the canvas.
     * @param y - The Y-coordinate of the mouse event, relative to the canvas.
     * @param ignoreConnections - If set to true, only returns non collection nodes.
     * @returns The node or connection part under the given coordinates, or `null` if none is found.
     */
    private getNodeAtPosition(
        x: number,
        y: number,
        ignoreConnections = false,
    ): Node | null {
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

            if (ignoreConnections) continue;

            for (const part of node.parts) {
                if (part.startPoint.containsDot(transformedX, transformedY)) {
                    if (part.startPoint.isSelected) return node;
                    return part.startPoint;
                }

                if (part.endPoint.containsDot(transformedX, transformedY)) {
                    if (part.endPoint.isSelected) return node;
                    return part.endPoint;
                }

                if (part.containsDot(transformedX, transformedY)) {
                    if (part.isSelected) return node;
                    return part;
                }
            }
        }
        return null;
    }

    private getNodeAtPositionForMoving(x: number, y: number): Node | null {
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
                    return part.startPoint;
                }

                if (part.endPoint.containsDot(transformedX, transformedY)) {
                    return part.endPoint;
                }

                if (part.containsDot(transformedX, transformedY)) {
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
        this._nodes.forEach((node) => node.deselect());
        this.render();
    }

    private saveChangesToLocalStorage(): void {
        if (this.virtual) return;
        localStorage.setItem(
            'file',
            JSON.stringify(this._nodes.map((node) => node.toSerializable())),
        );
    }
}
