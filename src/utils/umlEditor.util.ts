import mitt, {Emitter} from "mitt";
import {ClassNode, Method, Node, Property} from "./umlNodes.util.ts";

export class UmlEditorUtil {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private nodes: Node[] = [];
    private selectedNode: Node | null = null;
    private dragOffsetX: number = 0;
    private dragOffsetY: number = 0;
    private readonly emitter: Emitter<any> = mitt();

    private readonly TEXT_SIZE = 16;
    private readonly LINE_HEIGHT = 24;
    private readonly MARGIN_LEFT = 5;
    private readonly LINE_WIDTH_FILL_RATIO = 0.9;
    private readonly BORDER_SIZE = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

        this.render();
    }

    getEmitter(): Emitter<any> {
        return this.emitter;
    }

    getSelectedNode(): Node | null {
        return this.selectedNode;
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.nodes.forEach(node => this.drawNode(node));
    }

    addClassNode(x: number, y: number, name: string, properties: Property[], methods: Method[]): void {
        const newNode = new ClassNode(name, properties, methods, x, y, 150);

        this.nodes.push(newNode);
        this.render();
    }

    private drawNode(node: Node): void {
        if (node instanceof ClassNode) {
            this.drawRect(node.x, node.y, node.width, this.LINE_HEIGHT, node.isSelected);
            node.height = this.LINE_HEIGHT;

            this.drawText(node.name, node.x, node.y, node.width, node.isSelected, 'center')

            if (node.properties.length !== 0) {
                this.drawRect(node.x, node.y + this.LINE_HEIGHT, node.width, this.LINE_HEIGHT * node.properties.length, node.isSelected)
                node.height += this.LINE_HEIGHT * node.properties.length;

                for (const i in node.properties) {
                    let prop = node.properties[i];

                    this.drawText(prop.toString(), node.x, node.y + this.LINE_HEIGHT + (i * this.LINE_HEIGHT), node.width, node.isSelected);
                }
            }

            if (node.methods.length !== 0) {
                this.drawRect(node.x, node.y + (this.LINE_HEIGHT * node.properties.length), node.width, this.LINE_HEIGHT * node.methods.length, node.isSelected)
                node.height += this.LINE_HEIGHT * node.methods.length;

                //TODO: render text
            }
        }
    }

    private onMouseDown(event: MouseEvent): void {
        const { offsetX, offsetY } = event;

        this.selectedNode = this.getNodeAtPosition(offsetX, offsetY);
        this.emitter.emit('mouseDown', this.selectedNode);

        if (this.selectedNode) {
            this.selectedNode.isDragging = true;
            this.dragOffsetX = offsetX - this.selectedNode.x;
            this.dragOffsetY = offsetY - this.selectedNode.y;
            this.nodes.forEach(node => (node.isSelected = false));
            this.selectedNode.isSelected = true;
        } else {
            this.nodes.forEach(node => (node.isSelected = false));
        }
        this.render();
    }

    private onMouseUp(): void {
        if (this.selectedNode) {
            this.selectedNode.isDragging = false;
            this.selectedNode = null;
        }
        this.render();
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.selectedNode && this.selectedNode.isDragging) {
            const { offsetX, offsetY } = event;
            this.selectedNode.x = offsetX - this.dragOffsetX;
            this.selectedNode.y = offsetY - this.dragOffsetY;
            this.render();
        }
    }

    private getNodeAtPosition(x: number, y: number): Node | null {
        for (const node of this.nodes) {
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
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);

        this.ctx.fillStyle = isSelected ? "#DDDDFF" : "#FFFFFF";
        this.ctx.fill();
        this.ctx.lineWidth = this.BORDER_SIZE;
        this.ctx.strokeStyle = isSelected ? "#6666FF" : "#000000";
        this.ctx.stroke();
    }

    private drawText(text: string, x: number, y: number, width: number, isSelected=false, textAlign: CanvasTextAlign="left"): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = isSelected ? "#6666FF" : "#000000";
        this.ctx.font = `${this.TEXT_SIZE}px Arial`;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = "middle";

        switch (textAlign) {
            case "center":
                this.ctx.fillText(text, x + (width / 2), y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break
            case "left":
                this.ctx.fillText(text, x + this.MARGIN_LEFT, y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break;
            default:
                this.ctx.fillText(text, x, y + (this.LINE_HEIGHT / 2), width * this.LINE_WIDTH_FILL_RATIO);
                break;
        }
    }
}