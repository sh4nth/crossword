import React, { Component } from 'react';
import { Square } from "./Square";

type State = {
    boxes: Array<Square>;
};

function shouldBeBlack(i:number, j:number) {
    let randomFactor = (i*j*i*j*i + j*j*j + i*i*i*i -3*j + j*j)%100 > 80;
    return !(randomFactor || (i%2 == 1 && j%2 == 1))
}

export class Crossword extends Component<{}, State> {
    constructor(props: State) {
        super(props);
        let boxes = [];
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                boxes.push(new Square({ id: "B" + i + "-" + j, fillable: shouldBeBlack(i,j), letter: "A", x: i, y: j }));
            }
        }
        this.state = { boxes: boxes };
    }

    renderBoxes = () => {
        let renderedBoxes: Array<JSX.Element> = [];
        this.state.boxes.forEach(box => {
            renderedBoxes.push(box.render());
        });
        return renderedBoxes;
    };

    render() {
        return (<div className="Crossword">
            <svg id="crossword-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                {this.renderBoxes()}
            </svg>
        </div>);
    }
}

export default Crossword;