import paper from 'paper';

export class Transition {
    constructor(fromState, toState, label = '') {
        this.fromState = fromState;
        this.toState = toState;
        this.label = label;
        this.isSelfLoop = (fromState === toState);
        this.parallelPart = 0.5;
        this.perpendicularPart = 0;
        this.createVisuals();
        this.setupEventHandlers();
    }

    createVisuals() {
        this.group = new paper.Group();
        
        if (this.isSelfLoop) {
            this.createSelfLoop();
        } else {
            this.createRegularTransition();
        }
    }

    createSelfLoop() {
        this.group = new paper.Group();

        const verticalOffset = -25;
        this.center = this.fromState.position.add(new paper.Point(0, verticalOffset));

        const arcRadius = 18;
        this.path = new paper.Path.Arc({
            from: this.center.add(new paper.Point(-arcRadius, 5)),
            through: this.center.add(new paper.Point(0, -arcRadius)),
            to: this.center.add(new paper.Point(arcRadius, 5)),
            strokeColor: 'black',
            strokeWidth: 1.5
        });

        const arrowPos = this.center.add(new paper.Point(arcRadius, 5));
        const arrowAngle = Math.atan2(5, arcRadius) + Math.PI * 0.33;
        this.createArrow(arrowPos, arrowAngle);
        
        this.labelPosition = this.center.add(new paper.Point(0, -arcRadius - 5));
        
        this.group.addChildren([this.path, this.arrow]);
        
        if (this.label) {
            this.createLabel();
        }
    }

    createRegularTransition() {
        this.updatePath();
    }

    updatePath() {
        this.group.removeChildren();
        
        if (this.isSelfLoop) {
            this.center = this.fromState.position.add(new paper.Point(0, -25));
            const arcRadius = 18;
            
            this.path = new paper.Path.Arc({
                from: this.center.add(new paper.Point(-arcRadius, 5)),
                through: this.center.add(new paper.Point(0, -arcRadius)),
                to: this.center.add(new paper.Point(arcRadius, 5)),
                strokeColor: 'black',
                strokeWidth: 1.5
            });

            const arrowPos = this.center.add(new paper.Point(arcRadius, 5));
            const arrowAngle = Math.atan2(5, arcRadius) + Math.PI * 0.33;
            this.createArrow(arrowPos, arrowAngle);
            
            this.labelPosition = this.center.add(new paper.Point(0, -arcRadius - 5));
            
            this.group.addChildren([this.path, this.arrow]);
        } else {
            const start = this.fromState.position;
            const end = this.toState.position;
            
            const direction = end.subtract(start).normalize();
            const startPoint = start.add(direction.multiply(25));
            const endPoint = end.subtract(direction.multiply(25));

            this.path = new paper.Path.Line({
                from: startPoint,
                to: endPoint,
                strokeColor: 'black',
                strokeWidth: 1.5
            });

            const angle = Math.atan2(direction.y, direction.x);
            this.createArrow(endPoint, angle);
            
            const midPoint = startPoint.add(endPoint).divide(2);
            const perpendicular = direction.rotate(90).multiply(15);
            this.labelPosition = midPoint.add(perpendicular);
            
            this.group.addChildren([this.path, this.arrow]);
        }
        
        if (this.label) {
            this.createLabel();
        }
    }

    createArrow(position, angle) {
        const arrowSize = 8;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        
        this.arrow = new paper.Path([
            position,
            new paper.Point(
                position.x - dx * arrowSize + dy * 5,
                position.y - dy * arrowSize - dx * 5
            ),
            new paper.Point(
                position.x - dx * arrowSize - dy * 5,
                position.y - dy * arrowSize + dx * 5
            )
        ]);
        
        this.arrow.fillColor = 'black';
        this.arrow.closed = true;
    }

    createLabel() {
        if (this.labelText) {
            this.labelText.remove();
        }
        
        this.labelText = new paper.PointText({
            point: this.labelPosition,
            content: this.label,
            fillColor: 'black',
            fontSize: 12,
            justification: 'center'
        });
        
        this.group.addChild(this.labelText);
    }

    setupEventHandlers() {
        this.group.onDoubleClick = (event) => {
            this.editLabel();
            event.stopPropagation();
        };
    }

    editLabel() {
        const newLabel = prompt('Enter transition label:', this.label);
        if (newLabel !== null) {
            this.label = newLabel;
            this.createLabel();
        }
    }

    updatePosition() {
        this.updatePath();
    }

    setSelected(selected) {
        const color = selected ? 'blue' : 'black';
        this.path.strokeColor = new paper.Color(color);
        if (this.arrow) {
            this.arrow.fillColor = new paper.Color(color);
        }
    }

    contains(point) {
        if (this.isSelfLoop) {
            const distance = this.center.getDistance(point);
            return Math.abs(distance - 12) < 8;
        } else {
            return this.path.getNearestPoint(point).getDistance(point) < 8;
        }
    }

    remove() {
        this.group.remove();
    }
}