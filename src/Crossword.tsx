import React, { Component, MouseEvent, CSSProperties } from 'react';
import { Square, boxSize, BoxProps, SquareType } from "./Square";
import {cloneDeep, floor} from 'lodash';
import Switch from '@material-ui/core/Switch';
import {numberClues, Clue} from './Utils';

export type Point = {
    x: number,
    y: number,
}

enum Mode {
    SOLVE = "SOLVE",
    GRID = "GRID",
}

type State = {
    boxes: Array<Array<BoxProps>>,
    clues: Array<Clue>,
    cursor: Point,
    mode: Mode,
    isAcross: boolean,
};

function shouldBeBlack(i:number, j:number) {
    if (i%2 == 1 && j%2 == 1) {
        return SquareType.BLACK;
    } else {
        return SquareType.WHITE;
    }
}

const N = 5;

function containerStyle() {
    let size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    return {
        width: size,
        height: size,
    }
}

type CrosswordProps = {
    editable: boolean,
}

function cloneAndremoveHighlight(boxes: Array<Array<BoxProps>>) {
    let clonedBoxes = cloneDeep(boxes);
    clonedBoxes.forEach(row => row.forEach(box => {
        if(box.fillType == SquareType.ACTIVE) {
            box.fillType = SquareType.WHITE;
        }
    }));
    return clonedBoxes;
}

export class Crossword extends Component<CrosswordProps, State> {
    nameInput: HTMLInputElement | null | undefined;
    div: HTMLDivElement | null | undefined;

    public onClick(event: MouseEvent) {
        let x = floor(N * event.clientX / event.currentTarget.clientWidth);
        let y = floor(N * event.clientY / event.currentTarget.clientHeight);
        let point = {x: x, y: y};
        this.setState(state => {
            let clues = state.clues;
            let clonedBoxes = cloneAndremoveHighlight(state.boxes);
            let isAcross = state.isAcross;
            if (state.mode == Mode.GRID) {
                if (clonedBoxes[y][x].fillType == SquareType.BLACK) {
                    clonedBoxes[y][x].fillType = SquareType.WHITE;
                } else {
                    clonedBoxes[y][x].fillType = SquareType.BLACK;
                }
                clues = numberClues(clonedBoxes);
            } else {
                let possibleClues = clues.filter(c => c.contains(point));
                console.log(possibleClues);
                if (possibleClues.length > 2) {
                    throw new Error("Should not be possible")
                } else if (possibleClues.length == 2) {
                    let clue = possibleClues.filter(c => c.isAcross == state.isAcross)[0];
                    let points = clue.getPoints();
                    console.log(points);
                    points
                        .forEach(
                            p => {clonedBoxes[p.y][p.x].fillType = SquareType.ACTIVE;});
                    console.log("Found 2");
                } else if (possibleClues.length == 1) {
                    let clue = possibleClues[0];
                    isAcross = clue.isAcross;
                    let points = clue.getPoints();
                    console.log(points);
                    points
                        .forEach(
                            p => {clonedBoxes[p.y][p.x].fillType = SquareType.ACTIVE;});
                    console.log("Found just one");
                } else {
                    console.log("No clues at this point");
                }
            }
            return {boxes:clonedBoxes, cursor:point, clues: clues, isAcross: isAcross};
        });
        console.log(x + "," + y);
        // console.log(event.clientX + ", " + event.clientY);
        if (this.nameInput) {
            this.nameInput.focus();
        }
    }

    getNextPoint(p: Point) {
        if (p.x<0 || p.y < 0) {
            return p;
        }
        if (this.state.isAcross) {
            if (p.x < N-1) {
                return {x: p.x+1, y: p.y};
            } else {
                return p;
            }
        } else {
            if (p.y < N-1) {
                return {x: p.x, y: p.y+1};
            } else {
                return p;
            }
        }
    }

    onToggleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newMode = !e.currentTarget.checked ? Mode.SOLVE : Mode.GRID;
        this.setState(state => {
            return {mode: newMode, boxes: cloneAndremoveHighlight(state.boxes)}; });
    }

    onInputBoxChange() {
        let x = this.state.cursor.x;
        let y = this.state.cursor.y;
        if (x < 0 || y < 0 || this.state.boxes[y][x].fillType == SquareType.BLACK || !this.nameInput) {
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
            clonedBoxes[state.cursor.y][state.cursor.x].letter = pressedKey;
            return {boxes:clonedBoxes, cursor: this.getNextPoint(state.cursor)};
        });
    }

    constructor(props: CrosswordProps) {
        super(props);
        if (!props.editable) {
            console.log("To implmenet loading crossword later");
        }

        let boxes = [];
        for (var i = 0; i < N; i++) {
            let row = []
            for (var j = 0; j < N; j++) {
                row.push({
                    fillType: shouldBeBlack(i,j),
                    letter: "",
                    coords: {y: i, x: j},
                    clueNumber:""});
            }
            boxes.push(row);
        }
        this.state = { 
            boxes: boxes,
            clues: numberClues(boxes),
            cursor:{x: -1, y: -1}, 
            mode: Mode.SOLVE, 
            isAcross: true};
    }

    getHiddenBoxStyle() : CSSProperties {
        if(!this.div || this.state.mode == Mode.GRID) {
            return {
                visibility: "collapse",
            };
        }
        let size = this.div.clientWidth;
        return {
            left: size * (this.state.cursor.x / N),
            top: size * (this.state.cursor.y / N),
            width: size / N,
            height: size/ N,
            position: "absolute",
            background: "transparent",
            border: "none",
            textAlign: "center",
         }
    }

    hideIfNotEditable() : CSSProperties {
        if(!this.props.editable) {
            return {
                visibility: "collapse",
            };
        }
        return {
            visibility: "visible",
        };
    }

    render() {
        console.log("Render Cross" + this.state.boxes[0][0].letter);
        return (
        <div ref={div => {this.div = div;}} className="Crossword" style={containerStyle()} tabIndex={0}>
            <svg 
                onClick={e => this.onClick(e)}
                id="crossword-svg" viewBox={"0 0 " + N*boxSize + " " + N*boxSize} xmlns="http://www.w3.org/2000/svg">
                {this.state.boxes.map((row) => (
                    row.map((b) => {
                    return <Square 
                        key={b.coords.x + "-" + b.coords.y}
                        fillType={b.fillType}
                        coords={b.coords}
                        letter={b.letter}
                        clueNumber={b.clueNumber} />
                    })
                ))}
            </svg>
            <div style={this.hideIfNotEditable()} >Edit Grid<Switch value="Edit" onChange={e => this.onToggleChange(e)}/></div>
            <input value="" ref={input => {this.nameInput = input;}} 
            maxLength={1} 
            onClick={e => {this.setState(state => {return {isAcross: !state.isAcross}})}}
            onChange={e => this.onInputBoxChange()} 
            style={this.getHiddenBoxStyle()}/>
            <div className="blackSquare"></div>
        </div>);
    }
}

export default Crossword;