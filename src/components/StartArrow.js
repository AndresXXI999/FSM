import paper from 'paper';

export class StartArrow {
    constructor(targetState) {
        this.targetState = targetState;
        this.createVisuals();
        this.setupEventHandlers();
    }

    createVisuals() {
        this.group = new paper.Group();
        this.updatePosition();
    }

    updatePosition() {
        this.group.removeChildren();
        
        const startPoint = this.targetState.position.add([-60, 0]);
        const endPoint = this.targetState.position.add([-25, 0]);
        
        this.line = new paper.Path.Line({
            from: startPoint,
            to: endPoint,
            strokeColor: 'black',
            strokeWidth: 1.5
        });
        
        this.createArrow(endPoint, 0);
        
        this.label = new paper.PointText({
            point: startPoint.add([-10, 4]),
            fillColor: 'black',
            fontSize: 10,
            justification: 'center'
        });
        
        this.group.addChildren([this.line, this.arrow, this.label]);
    }

    createArrow(position, angle) {
        const arrowSize = 8;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        
        this.arrow = new paper.Path([
            position,
            position.subtract([dx * arrowSize - dy * 5, dy * arrowSize + dx * 5]),
            position.subtract([dx * arrowSize + dy * 5, dy * arrowSize - dx * 5])
        ]);
        
        this.arrow.fillColor = 'black';
        this.arrow.closed = true;
    }

    setupEventHandlers() {
        this.group.onDoubleClick = (event) => {
            event.stopPropagation();
        };
    }

    setSelected(selected) {
        const color = selected ? 'blue' : 'black';
        this.line.strokeColor = new paper.Color(color);
        this.arrow.fillColor = new paper.Color(color);
    }

    contains(point) {
        return this.line.getNearestPoint(point).getDistance(point) < 8;
    }

    remove() {
        this.group.remove();
    }
}