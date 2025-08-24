import paper from 'paper';
import { StateManager } from './managers/StateManager.js'

paper.setup('paperCanvas');

const stateManager = new StateManager();

paper.view.onDoubleClick = (event) => {
    stateManager.handleCanvasDoubleClick(event.point);
    paper.view.draw();
};

paper.view.onMouseDown = (event) => {
    stateManager.handleMouseDown(event.point);
};

paper.view.onMouseDrag = (event) => {
    stateManager.handleMouseDrag(event.point);
    paper.view.draw();
};

paper.view.onMouseUp = (event) => {
    stateManager.handleMouseUp(event.point);
    paper.view.draw();
};

window.addEventListener('keydown', (event) => {
    stateManager.handleKeyDown(event.key);
    paper.view.draw();
});

window.addEventListener('keyup', (event) => {
    stateManager.handleKeyUp(event.key);
    paper.view.draw();
});

paper.view.draw();