import paper from 'paper';
import { Transition } from '/components/Transition.js';

export class TransitionManager {
    constructor() {
        this.transitions = [];
        this.selectedTransition = null;
        this.isCreatingTransition = false;
        this.transitionStartState = null;
        this.temporaryLine = null;
    }

    createTransition(fromState, toState, label = '') {
        const existing = this.transitions.find(t => 
            t.fromState === fromState && t.toState === toState
        );
        
        if (existing) {
            existing.editLabel();
            return existing;
        }

        const transition = new Transition(fromState, toState, label);
        transition.createLabel();
        this.transitions.push(transition);
        return transition;
    }

    findTransitionAt(point) {
        return this.transitions.find(transition => transition.contains(point));
    }

    startTransitionCreation(fromState) {
        this.isCreatingTransition = true;
        this.transitionStartState = fromState;
        
        fromState.outerCircle.strokeColor = new paper.Color('green');
    }

    updateTransitionCreation(mousePoint) {
        if (!this.isCreatingTransition) return;

        if (this.temporaryLine) {
            this.temporaryLine.remove();
        }

        const startPoint = this.transitionStartState.position;
        this.temporaryLine = new paper.Path.Line({
            from: startPoint,
            to: mousePoint,
            strokeColor: 'gray',
            strokeWidth: 1,
            dashArray: [5, 5]
        });
    }

    finishTransitionCreation(toState) {
        if (!this.isCreatingTransition || !this.transitionStartState) return;

        if (this.temporaryLine) {
            this.temporaryLine.remove();
            this.temporaryLine = null;
        }

        this.transitionStartState.outerCircle.strokeColor = new paper.Color('black');

        if (toState) {
            this.createTransition(this.transitionStartState, toState);
        }

        this.isCreatingTransition = false;
        this.transitionStartState = null;
    }

    cancelTransitionCreation() {
        if (this.temporaryLine) {
            this.temporaryLine.remove();
            this.temporaryLine = null;
        }
        
        if (this.transitionStartState) {
            this.transitionStartState.outerCircle.strokeColor = new paper.Color('black');
        }

        this.isCreatingTransition = false;
        this.transitionStartState = null;
    }

    setSelectedTransition(transition) {
        if (this.selectedTransition) {
            this.selectedTransition.setSelected(false);
        }
        
        this.selectedTransition = transition;
        
        if (this.selectedTransition) {
            this.selectedTransition.setSelected(true);
        }
    }

    updateTransitionsForState(state) {
        this.transitions.forEach(transition => {
            if (transition.fromState === state || transition.toState === state) {
                transition.updatePosition();
            }
        });
    }

    removeTransitionsForState(state) {
        this.transitions = this.transitions.filter(transition => {
            if (transition.fromState === state || transition.toState === state) {
                transition.remove();
                return false;
            }
            return true;
        });
        
        if (this.selectedTransition && 
            (this.selectedTransition.fromState === state || this.selectedTransition.toState === state)) {
            this.selectedTransition = null;
        }
    }

    deleteSelectedTransition() {
        if (!this.selectedTransition) return;
        
        const index = this.transitions.indexOf(this.selectedTransition);
        if (index !== -1) {
            this.selectedTransition.remove();
            this.transitions.splice(index, 1);
            this.selectedTransition = null;
        }
    }

    handleClick(point) {
        const transition = this.findTransitionAt(point);
        this.setSelectedTransition(transition);
        return transition;
    }

    handleKeyDown(key) {
        if (key === 'Delete' || key === 'Backspace') {
            this.deleteSelectedTransition();
        } else if (key === 'Escape') {
            this.cancelTransitionCreation();
        }
    }
}