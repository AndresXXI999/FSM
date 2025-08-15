import paper from 'paper';

export class State {
    static STATE_RADIUS = 22;
    static INNER_RADIUS = 18;

    constructor(point, name = 'q0') {
        this.position = point;
        this.name = name;
        this.isFinal = false;
        this.createVisuals();
        this.setupEventHandlers();
    }

    createVisuals() {
        this.group = new paper.Group();
        
        this.outerCircle = new paper.Path.Circle({
            center: this.position,
            radius: State.STATE_RADIUS,
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 2
        });
        
        this.innerCircle = new paper.Path.Circle({
            center: this.position,
            radius: State.INNER_RADIUS,
            strokeColor: 'black',
            strokeWidth: 1,
            visible: false
        });
        
        this.label = new paper.PointText({
            point: this.position.add([0, 3]),
            content: this.name,
            fillColor: 'black',
            fontSize: 10,
            justification: 'center'
        });
        
        this.group.addChildren([this.outerCircle, this.innerCircle, this.label]);
    }

    setupEventHandlers() {
        this.group.onDoubleClick = (event) => {
            this.handleDoubleClick(event);
            event.stopPropagation();
        };
    }

    handleDoubleClick(event) {
        const point = event.point;
        const labelPos = this.label.point;
        const distanceToLabel = labelPos.getDistance(point);
        
        if (distanceToLabel < 12) {
            this.editLabel();
            event.stopPropagation();
        } else {
            this.toggleFinalState();
        }
    }

    toggleFinalState() {
        this.isFinal = !this.isFinal;
        this.innerCircle.visible = this.isFinal;
    }

    editLabel() {
        const newName = prompt('Enter state name:', this.name);
        if (newName !== null) {
            this.name = newName;
            this.label.content = newName;
        }
    }

    move(delta) {
        const newPosition = this.position.add(delta);
        
        const canvasBounds = paper.view.bounds;
        const radius = State.STATE_RADIUS;
        
        const clampedX = Math.max(canvasBounds.left + radius, 
                                Math.min(canvasBounds.right - radius, newPosition.x));
        const clampedY = Math.max(canvasBounds.top + radius, 
                                Math.min(canvasBounds.bottom - radius, newPosition.y));
        
        this.position = new paper.Point(clampedX, clampedY);
        this.group.position = this.position;
    }

    contains(point) {
        return this.position.getDistance(point) <= State.STATE_RADIUS + 5;
    }

    remove() {
        this.group.remove();
    }
}