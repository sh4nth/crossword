import React, { Component } from 'react';
import { Square, boxSize } from "./Square";

type State = {
    boxes: Array<Square>;
};

function shouldBeBlack(i:number, j:number) {
    let randomFactor = (i*j*i*j*i + j*j*j + i*i*i*i -3*j + j*j)%100 > 99;
    return !(randomFactor || (i%2 == 1 && j%2 == 1))
}

const N = 5;

export class Crossword extends Component<{}, State> {
    constructor(props: State) {
        super(props);
        let boxes = [];
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                boxes.push(new Square({id: "B" + i + "-" + j, fillable: shouldBeBlack(i,j), letter: "A", x: i, y: j, clueNumber:"" + (1+i+N*j) }));
            }
        }
        this.state = { boxes: boxes };
    }

    renderBoxes = () => {
        let renderedBoxes: Array<any> = [];
        this.state.boxes.forEach(box => {
            renderedBoxes.push(box.render());
        });
        return renderedBoxes;
    };

    public componentDidMount() {
        console.log("ComponentDidMount Crossword");
    }

    render() {
        return (<div className="Crossword">
            <svg id="crossword-svg" viewBox={"0 0 " + N*boxSize + " " + N*boxSize} xmlns="http://www.w3.org/2000/svg">
                {this.renderBoxes()}
            </svg>
        </div>);
    }
}

export default Crossword;