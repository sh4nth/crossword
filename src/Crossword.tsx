import React, { Component, KeyboardEvent, MouseEvent, createRef } from 'react';
import { Square, boxSize, BoxProps } from "./Square";
import {cloneDeep, floor} from 'lodash';

type State = {
    boxes: Array<Array<BoxProps>>,
    i: number,
    j: number,
    isSolver: boolean,
};

function shouldBeBlack(i:number, j:number) {
    return !(i%2 == 1 && j%2 == 1)
}

const N = 5;

export class Crossword extends Component<{}, State> {
    public onClick(event: MouseEvent) {
        let i = floor(N * event.clientX / event.currentTarget.clientWidth);
        let j = floor(N * event.clientY / event.currentTarget.clientHeight);
        this.setState(state => {
            let clonedBoxes = cloneDeep(state.boxes);
            clonedBoxes[i][j].fillable = !clonedBoxes[i][j].fillable;
            return {boxes:clonedBoxes, i: i, j: j};
        });
        console.log(i + "," + j);
        console.log(event.clientX + ", " + event.clientY);
    }

    public onKeyPress(key: KeyboardEvent) {
        let i = this.state.i;
        let j = this.state.j;
        if (i < 0 || j < 0 || !this.state.boxes[i][j].fillable) {
            console.log("Ignoring keyEvent " + key.key);
            return;
        }
        let pressedKey = key.key
        if (pressedKey.length > 1) {
            throw new Error("Strange key: " + pressedKey)
        } 
        pressedKey = pressedKey.toUpperCase();
        if (pressedKey > 'Z' || pressedKey < 'A') {
            console.log("Ignoring key " + pressedKey);
            return;
        }
        this.setState(state => {
            let clonedBoxes = cloneDeep(state.boxes);
            clonedBoxes[state.i][state.j].letter = pressedKey;
            return {boxes:clonedBoxes};
        });
    }

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
        this.state = { boxes: boxes, i: -1, j: -1, isSolver: true};
    }

    render() {
        console.log("Render Cross" + this.state.boxes[0][0].letter);
        return (
        <div className="Crossword" 
            onKeyPress={(e) => this.onKeyPress(e)} 
            tabIndex={0}>
            <svg 
                onClick={e => this.onClick(e)}
                id="crossword-svg" viewBox={"0 0 " + N*boxSize + " " + N*boxSize} xmlns="http://www.w3.org/2000/svg">
                {this.state.boxes.map((row) => (
                    row.map((b) => {
                    console.log("In CRender: " + b.id + " - " + b.letter);
                    return <Square 
                        key={b.id}
                        fillable={b.fillable}
                        y={b.y}
                        x={b.x} 
                        id={b.id}
                        letter={b.letter}
                        clueNumber={b.clueNumber} />
                    })
                ))}
            </svg>
        </div>);
    }
}

export default Crossword;