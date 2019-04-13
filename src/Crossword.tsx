import React, { Component, KeyboardEvent, MouseEvent, createRef, CSSProperties } from 'react';
import { Square, boxSize, BoxProps } from "./Square";
import {cloneDeep, floor, min} from 'lodash';

type Point = {
    i: number,
    j: number,
}
type State = {
    boxes: Array<Array<BoxProps>>,
    point: Point,
    isSolver: boolean,
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
            return {boxes:clonedBoxes, point:{i: i, j: j}};
        });
        console.log(i + "," + j);
        console.log(event.clientX + ", " + event.clientY);
    }

    public onKeyPress(key: KeyboardEvent) {
        if (this.nameInput) {
            this.nameInput.value="";
        }
        let i = this.state.point.i;
        let j = this.state.point.j;
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
            clonedBoxes[state.point.i][state.point.j].letter = pressedKey;
            return {boxes:clonedBoxes, };
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
        this.state = { boxes: boxes, point:{i: -1, j: -1}, isSolver: true};
    }

    getHiddenBoxStyle() : CSSProperties {
        let size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
        return {
            left: size * (this.state.point.i / N),
            top: size * (this.state.point.j / N),
            width: size / N,
            height: size/ N,
            position: "absolute",
            background: "transparent",
            border: "none",
         }
    }

    componentDidMount(){
        console.log("Getting focus");
        if (this.nameInput) { 
            this.nameInput.focus();
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
            <input autoFocus ref={(input) => { this.nameInput = input; }} 
            maxLength={1} onKeyPress={(e) => this.onKeyPress(e)} style={this.getHiddenBoxStyle()}/>
        </div>);
    }
}

export default Crossword;