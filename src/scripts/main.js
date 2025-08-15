import paper from 'paper';
import '../styles/styles.css';

paper.setup('paperCanvas');

paper.view.onDoubleClick = function (event) {
    // Prueba de colision con 5px de tolerancia para prevenir circulos montados
    var resColision = paper.project.hitTest(event.point, {
        fill: true,
        stroke: true,
        tolerance: 5 // Espacio invisible en los bordes del circulo
    });

    if (resColision && resColision.item) {
        return;
    }
    
    var circuloExterior = new paper.Path.Circle({
        center: event.point,
        radius: 25,
        fillColor: 'white',
        strokeColor: 'black',
        strokeWidth: 2
    });

    var texto = new paper.PointText({
        point: event.point,
        content: 'q0',
        fillColor: 'black',
        fontSize: 12,
        justification: 'center'
    });
    
    // Hacemos el texto no interacivo asi arrastramos unicamente el circulo exterior
    texto.hitTest = function() {
        return false;
    };

    circuloExterior.texto = texto;
    circuloExterior.circuloInterior = null;

    texto.onDoubleClick = function(event) {
        var newText = prompt("Enter state name:", this.content);
        if (newText) {
            this.content = newText;
        }
        event.stopPropagation();
    };

    circuloExterior.onDoubleClick = function(event) {
        if(this.circuloInterior) {
            this.circuloInterior.remove();
            this.circuloInterior = null;
        } else {
            this.circuloInterior = new paper.Path.Circle({
                center: this.position,
                radius: 20,
                strokeColor: 'black',
                strokeWidth: 1
            });
            // Hacemos el circulo interior no ineractivo para arrastrar unicamente el circulo exterior
            this.circuloInterior.hitTest = function() {
                return false;
            };
        }
        event.stopPropagation();
    }

    // Funcionalidad de arrastre
    circuloExterior.dragging = false;
    
    circuloExterior.onMouseDown = function(event) {
        this.dragging = true;
        this.dragOffset = event.point.subtract(this.position);
    }

    circuloExterior.onMouseDrag = function(event) {
        if (!this.dragging) return;
        
        // Calculamos la nueva posicion con un offset
        const newPosition = event.point.subtract(this.dragOffset);
        const delta = newPosition.subtract(this.position);
        
        // Actualizamos la posicion de todos los elementos
        this.position = newPosition;
        this.texto.position = this.texto.position.add(delta);
        
        // Arrastramos el circulo interior si existe
        if (this.circuloInterior) {
            this.circuloInterior.position = this.circuloInterior.position.add(delta);
        }
    }

    circuloExterior.onMouseUp = function() {
        this.dragging = false;
    }
};

paper.view.draw();