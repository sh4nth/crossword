import React, { Component, KeyboardEvent, MouseEvent, createRef, CSSProperties } from 'react';
import { Square, boxSize, BoxProps } from "./Square";
import {cloneDeep, floor, min} from 'lodash';

type Point = {
    i: number,
    j: number,
}

type State = {
    boxes: Array<Array<BoxProps>>,
    cursor: Point,
    isSolver: boolean,
    isHorizontal: boolean,
};

function shouldBeBlack(i:number, j:number) {
    return !(i%2 == 1 && j%2 == 1)
}

const N = 5;

function containerStyle() {
    let size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    return {
        width: size,
        height: size,
    }
}

export class Crossword extends Component<{}, State> {
    nameInput: HTMLInputElement | null | undefined;
    public onClick(event: MouseEvent) {
        let i = floor(N * event.clientX / event.currentTarget.clientWidth);
        let j = floor(N * event.clientY / event.currentTarget.clientHeight);
        this.setState(state => {
            let clonedBoxes = cloneDeep(state.boxes);
            // clonedBoxes[i][j].fillable = !clonedBoxes[i][j].fillable;
            return {boxes:clonedBoxes, cursor:{i: i, j: j}};
        });
        console.log(i + "," + j);
        console.log(event.clientX + ", " + event.clientY);
        if (this.nameInput) { 
            this.nameInput.focus();
        }
    }

    getNextPoint(p: Point) {
        if (p.i<0 || p.j < 0) {
            return p;
        }
        if (this.state.isHorizontal) {
            if (p.i < N-1) {
                return {i: p.i+1, j: p.j};
            } else {
                return p;
            }
        } else {
            if (p.j < N-1) {
                return {i: p.i, j: p.j+1};
            } else {
                return p;
            }
        }
    }

    public onChange() {
        let i = this.state.cursor.i;
        let j = this.state.cursor.j;
        if (i < 0 || j < 0 || !this.state.boxes[i][j].fillable || !this.nameInput) {
            console.log("Ignoring changeEvent");
            return;
        }

        let pressedKey = this.nameInput.value;
        pressedKey = pressedKey.toUpperCase();
        if (pressedKey > 'Z' || pressedKey < 'A') {
            console.log("Ignoring key " + pressedKey);
            return;
        }
        this.setState(state => {
            let clonedBoxes = cloneDeep(state.boxes);
            clonedBoxes[state.cursor.i][state.cursor.j].letter = pressedKey;
            return {boxes:clonedBoxes, cursor: this.getNextPoint(state.cursor)};
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
        this.state = { 
            boxes: boxes, 
            cursor:{i: -1, j: -1}, 
            isSolver: true, 
            isHorizontal: true};
    }

    getHiddenBoxStyle() : CSSProperties {
        let size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
        return {
            left: size * (this.state.cursor.i / N),
            top: size * (this.state.cursor.j / N),
            width: size / N,
            height: size/ N,
            position: "absolute",
            background: "transparent",
            border: "none",
            textAlign: "center",
         }
    }

      render() {
        console.log("Render Cross" + this.state.boxes[0][0].letter);
        return (
        <div className="Crossword" style={containerStyle()} tabIndex={0}>
            <svg 
                onClick={e => this.onClick(e)}
                id="crossword-svg" viewBox={"0 0 " + N*boxSize + " " + N*boxSize} xmlns="http://www.w3.org/2000/svg">
                {this.state.boxes.map((row) => (
                    row.map((b) => {
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
            <input value="" ref={(input) => { this.nameInput = input; }} 
            maxLength={1} onChange={(e) => this.onChange()} style={this.getHiddenBoxStyle()}/>
        </div>);
    }
}

export default Crossword;