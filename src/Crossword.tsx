import React, { Component } from 'react';
import { Square, boxSize, BoxState } from "./Square";

type State = {
    boxes: Array<Array<BoxState>>;
};

function shouldBeBlack(i:number, j:number) {
    let randomFactor = (i*j*i*j*i + j*j*j + i*i*i*i -3*j + j*j)%100 > 99;
    return !(randomFactor || (i%2 == 1 && j%2 == 1))
}

const N = 5;

export class Crossword extends Component<{}, State> {


    // public onKeyPress(key: KeyboardEvent) {
    //     console.log("keyEvent");
    //     this.setState(state => {
    //         const list = ;
    //         state.boxes[0][0].letter = "A";
    //         return state.boxes;
    //     });
    // }

    constructor(props: State) {
        super(props);
        let boxes = [];
        for (var i = 0; i < N; i++) {
            let row = []
            for (var j = 0; j < N; j++) {
                row.push({id: i + "-" + j, fillable: shouldBeBlack(i,j), letter: "", x: i, y: j, clueNumber:"" + (1+i+N*j) });
            }
            boxes.push(row);
        }
        this.state = { boxes: boxes };
    }

    render() {
        return (<div className="Crossword">
            <svg id="crossword-svg" viewBox={"0 0 " + N*boxSize + " " + N*boxSize} xmlns="http://www.w3.org/2000/svg">
                {this.state.boxes.map((row) => (
                    row.map((b) =>
                    <Square key={b.id} fillable={b.fillable} y={b.y} x={b.x} id={b.id} letter={b.letter} clueNumber={b.clueNumber} />
                    )
                ))}
            </svg>
        </div>);
    }
}

export default Crossword;