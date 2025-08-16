import paper from 'paper';
import { State } from '/components/State.js';
import { TransitionManager } from '/managers/TransitionManager.js';
import { StartArrow } from '/components/StartArrow.js';

export class StateManager {
    constructor() {
        this.states = [];
        this.selectedState = null;
        this.transitionManager = new TransitionManager();
        this.selectedObject = null;
        this.isShiftPressed = false;
        this.startArrow = null;
        this.initialState = null;
    }

    createState(point, name = 'q0') {
        const state = new State(point, name);
        this.states.push(state);
        
        if (this.states.length === 1) {
            this.setInitialState(state);
        }
        
        return state;
    }

    setInitialState(state) {
        this.initialState = state;
        
        if (this.startArrow) {
            this.startArrow.remove();
        }
        
        this.startArrow = new StartArrow(state);
    }

    findStateAt(point) {
        return this.states.find(state => state.contains(point));
    }

    setSelectedState(state) {
        if (this.selectedState) {
            this.selectedState.outerCircle.strokeColor = new paper.Color('black');
        }
        
        this.transitionManager.setSelectedTransition(null);
        
        this.selectedState = state;
        this.selectedObject = state;
        
        if (this.selectedState) {
            this.selectedState.outerCircle.strokeColor = new paper.Color('blue');
        }
    }

    setSelectedTransition(transition) {
        if (this.selectedState) {
            this.selectedState.outerCircle.strokeColor = new paper.Color('black');
            this.selectedState = null;
        }
        
        this.transitionManager.setSelectedTransition(transition);
        this.selectedObject = transition;
    }

    deleteSelectedState() {
        if (!this.selectedState) return;
        
        this.transitionManager.removeTransitionsForState(this.selectedState);
        
        if (this.selectedState === this.initialState) {
            if (this.startArrow) {
                this.startArrow.remove();
                this.startArrow = null;
            }
            this.initialState = null;
            
            const remainingStates = this.states.filter(s => s !== this.selectedState);
            if (remainingStates.length > 0) {
                this.setInitialState(remainingStates[0]);
            }
        }
        
        const index = this.states.indexOf(this.selectedState);
        if (index !== -1) {
            this.selectedState.remove();
            this.states.splice(index, 1);
            this.selectedState = null;
            this.selectedObject = null;
        }
    }

    handleCanvasDoubleClick(point) {
        const state = this.findStateAt(point);
        if (state) return;
        
        const transition = this.transitionManager.findTransitionAt(point);
        if (transition) return;
        
        this.createState(point);
    }

    handleMouseDown(point) {
        const clickedState = this.findStateAt(point);
        const clickedTransition = this.transitionManager.findTransitionAt(point);
        
        if (this.isShiftPressed && clickedState) {
            this.transitionManager.startTransitionCreation(clickedState);
        } else if (clickedState) {
            this.setSelectedState(clickedState);
            this.selectedState.dragOffset = this.selectedState.position.subtract(point);
        } else if (clickedTransition) {
            this.setSelectedTransition(clickedTransition);
        } else if (this.startArrow && this.startArrow.contains(point)) {
            this.selectedObject = this.startArrow;
        } else {
            this.setSelectedState(null);
            this.setSelectedTransition(null);
            this.selectedObject = null;
        }
    }

    handleMouseDrag(point) {
        if (this.transitionManager.isCreatingTransition) {
            this.transitionManager.updateTransitionCreation(point);
            return;
        }

        if (this.selectedState && this.selectedState.dragOffset) {
            const newPosition = point.add(this.selectedState.dragOffset);
            const delta = newPosition.subtract(this.selectedState.position);
            this.selectedState.move(delta);
            
            this.transitionManager.updateTransitionsForState(this.selectedState);
            
            if (this.selectedState === this.initialState && this.startArrow) {
                this.startArrow.updatePosition();
            }
        }
    }

    handleMouseUp(point) {
        if (this.transitionManager.isCreatingTransition) {
            const targetState = this.findStateAt(point);
            this.transitionManager.finishTransitionCreation(targetState);
        }

        if (this.selectedState) {
            delete this.selectedState.dragOffset;
        }
    }

    handleKeyDown(key) {
        if (key === 'Shift') {
            this.isShiftPressed = true;
        } else if (key === 'Delete' || key === 'Backspace') {
            if (this.selectedState) {
                this.deleteSelectedState();
            } else if (this.transitionManager.selectedTransition) {
                this.transitionManager.deleteSelectedTransition();
                this.selectedObject = null;
            }
        } else {
            this.transitionManager.handleKeyDown(key);
        }
    }

    handleKeyUp(key) {
        if (key === 'Shift') {
            this.isShiftPressed = false;
        }
    }
}