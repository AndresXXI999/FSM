import paper from 'paper';
import { State } from '/components/State.js';

export class StateManager {
    constructor() {
        this.states = [];
        this.selectedState = null;
    }

    createState(point, name = 'q0') {
        const state = new State(point, name);
        this.states.push(state);
        return state;
    }

    findStateAt(point) {
        return this.states.find(state => state.contains(point));
    }

    setSelectedState(state) {
        if (this.selectedState) {
            this.selectedState.outerCircle.strokeColor = new paper.Color('black');
        }
        
        this.selectedState = state;
        
        if (this.selectedState) {
            this.selectedState.outerCircle.strokeColor = new paper.Color('blue');
        }
    }

    deleteSelectedState() {
        if (!this.selectedState) return;
        
        const index = this.states.indexOf(this.selectedState);
        if (index !== -1) {
            this.selectedState.remove();
            this.states.splice(index, 1);
            this.selectedState = null;
        }
    }

    handleCanvasDoubleClick(point) {
        const state = this.findStateAt(point);
        if (state) return;
        
        this.createState(point);
    }

    handleMouseDown(point) {
        const clickedState = this.findStateAt(point);
        
        this.setSelectedState(clickedState);
        
        if (this.selectedState) {
            this.selectedState.dragOffset = this.selectedState.position.subtract(point);
        }
    }

    handleMouseDrag(point) {
        if (this.selectedState && this.selectedState.dragOffset) {
            const newPosition = point.add(this.selectedState.dragOffset);
            const delta = newPosition.subtract(this.selectedState.position);
            this.selectedState.move(delta);
        }
    }

    handleMouseUp() {
        if (this.selectedState) {
            delete this.selectedState.dragOffset;
        }
    }

    handleKeyDown(key) {
        if (key === 'Delete' || key === 'Backspace') {
            this.deleteSelectedState();
        }
    }
}