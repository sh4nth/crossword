import { Button, Select, MenuItem, Input } from '@material-ui/core';
import React, { Component, MouseEvent, CSSProperties, createRef, RefObject } from 'react';
import { cloneDeep, floor } from 'lodash';
import Puz from 'puzjs';
import { solve } from './Backtrack';
import { numberClues, Clue } from './Clue';
import { Square, boxSize, BoxProps, SquareType } from "./Square";

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
    N: number,
};

function shouldBeBlack(i:number, j:number, N:number) {
    if (N === 15) {
        if ((i<3 || i>=N-3) && (j === 5 || j === 9)) {
            return SquareType.BLACK;
        } else if ((j<3 && i === 6) || (j >=N-3 && i === 8)) {
            return SquareType.BLACK;
        } else if (i === 5 && Math.abs(j-(N-1)/2) <= 1) {
            return SquareType.BLACK;
        } else if (i === 9 && Math.abs(j-(N-1)/2) <= 1) {
            return SquareType.BLACK;
        } else if (i === j && (i === 3 || i === 11)) {
            return SquareType.BLACK;
        } else if ((i + j === 14) && (i === 3 || i === 4)) {
            return SquareType.BLACK;
        } else if ((i + j === 14) && (i === 10 || i ===11)) {
            return SquareType.BLACK;
        } else if ((i === 10 && j === 3) || (i === 4 && j ===11)) {
            return SquareType.BLACK;
        } else if ((i === 7) && ( j === 4 || j ===9 || j === 5 || j === 10)) {
            return SquareType.BLACK;
        }
        return SquareType.WHITE;
    }
    let XOR = (a:boolean, b:boolean) => (a || b) && !(a && b);
    let mid = (N-1)/2
    let isInFirstOrThirdQuadrant = (i > mid && j < mid) || (i < mid && j > mid);
    if (i%2 === 1 &&  XOR(j%2 === 1, isInFirstOrThirdQuadrant)) {
        return SquareType.BLACK;
    } else {
        return SquareType.WHITE;
    }
}


type CrosswordProps = {
    editable: boolean,
}

function cloneBoxes(boxes: Array<Array<BoxProps>>, removeHighlight: boolean, clear:boolean) {
    let clonedBoxes = cloneDeep(boxes);
    clonedBoxes.forEach(row => row.forEach(box => {
        if(removeHighlight && box.fillType === SquareType.ACTIVE) {
            box.fillType = SquareType.WHITE;
        }
        if(clear && box.fillType !== SquareType.LOCKED) {
            box.letter = ".";
        }
    }));
    return clonedBoxes;
}

function cloneAndremoveHighlight(boxes: Array<Array<BoxProps>>) {
    return cloneBoxes(boxes, true, false);
}

function lockClue(boxes: Array<Array<BoxProps>>, clue: Clue) {
    let clonedBoxes = cloneDeep(boxes);
    let startX = clue.start.x;
    let startY = clue.start.y;
    let box = clonedBoxes[startY][startX];
    for (let i = 0; i<clue.length; i++) {
        if (clue.isAcross) {
            box = clonedBoxes[startY][startX + i];
        } else {
            box = clonedBoxes[startY + i][startX];
        }
        if (clue.state.isLocked) {
            box.fillType = SquareType.LOCKED;
        } else {
            box.fillType = SquareType.ACTIVE;
        }
    }
    return clonedBoxes;
}

export class Crossword extends Component<CrosswordProps, State> {
    nameInput: RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    div: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    specialWords: RefObject<HTMLInputElement> = createRef<HTMLInputElement>();

    public onClick(event: MouseEvent) {
        let rect = event.currentTarget.getBoundingClientRect();
        let x = floor(this.state.N * (event.clientX - rect.left) / rect.width);
        let y = floor(this.state.N * (event.clientY - rect.top) / rect.height);
        console.log(x + ", " + y);
        let point = {x: x, y: y};
        this.setState(state => {
            let clues = state.clues;
            let clonedBoxes = cloneAndremoveHighlight(state.boxes);
            let isAcross = state.isAcross;
            if (state.mode === Mode.GRID) {
                if (clonedBoxes[y][x].fillType === SquareType.BLACK) {
                    clonedBoxes[y][x].fillType = SquareType.WHITE;
                    clonedBoxes[state.N - 1 - y][state.N - 1 - x].fillType = SquareType.WHITE;
                } else {
                    clonedBoxes[y][x].fillType = SquareType.BLACK;
                    clonedBoxes[state.N - 1 - y][state.N - 1 - x].fillType = SquareType.BLACK;
                }
                clues = numberClues(clonedBoxes);
            } else {
                isAcross = this.trySetIsAcrossAndHighlight(clonedBoxes, clues, state.isAcross, point);
            }
            return {boxes:clonedBoxes, cursor:point, clues: clues, isAcross: isAcross};
        });
        if (this.nameInput.current) {
            this.nameInput.current.focus();
        }
    }

    // Caller must set state using the new clonedBoxes
    trySetIsAcrossAndHighlight(clonedBoxes:Array<Array<BoxProps>>, clues: Array<Clue>, isAcross: boolean, point: Point) {
        let possibleClues = clues.filter(c => c.contains(point));
                if (possibleClues.length > 2) {
                    throw new Error("Should not be possible");
                } else if (possibleClues.length === 2) {
                    let clue = possibleClues.filter(c => c.isAcross === isAcross)[0];
                    clue.getPoints().forEach(
                            p => {
                                let box = clonedBoxes[p.y][p.x];
                                if (box.fillType !== SquareType.LOCKED) {
                                    box.fillType = SquareType.ACTIVE;
                                }
                            });
                } else if (possibleClues.length === 1) {
                    let clue = possibleClues[0];
                    isAcross = clue.isAcross;
                    clue.getPoints().forEach(
                        p => {
                            let box = clonedBoxes[p.y][p.x];
                            if (box.fillType !== SquareType.LOCKED) {
                                box.fillType = SquareType.ACTIVE;
                            }
                        });
                } else {
                    console.log("No clues at this point");
                }
                return isAcross;
    }

    getNextPoint(p: Point) {
        if (p.x<0 || p.y < 0) {
            return p;
        }
        if (this.state.isAcross) {
            if (p.x < this.state.N-1) {
                return {x: p.x+1, y: p.y};
            } else {
                return p;
            }
        } else {
            if (p.y < this.state.N-1) {
                return {x: p.x, y: p.y+1};
            } else {
                return p;
            }
        }
    }

    onToggleChange(e: any) {
        let getNextMode = (mode:Mode) => {return mode === Mode.GRID? Mode.SOLVE : Mode.GRID};
        this.setState(state => {
            return {mode: getNextMode(state.mode), boxes: cloneAndremoveHighlight(state.boxes)}; });
    }

    onClueLock(clue: Clue) {
        let shouldBeLocked = !clue.state.isLocked;
        clue.state.isLocked = shouldBeLocked;
        clue.state.isFilled = shouldBeLocked;
        let clonedBoxes = lockClue(this.state.boxes, clue);
        this.setState(state => {
            return {
                clues: state.clues,
                boxes: clonedBoxes
            }; });
    }

    onSave() {
        console.log("Saving .puz is stubbed for now.");
        // TODO: Only allow exporting filled crosswords
        let across = this.state.clues.filter(c => c.isAcross).map(c => c.clueTextRef.current.value);
        let down = this.state.clues.filter(c => !c.isAcross).map(c => c.clueTextRef.current.value);
        let puzzle = {
            meta: {
                title: "Crossword by Shanth",
                author: "Shanthanu",
                copyright: "CC",
            },
            // puzjs expects the solved crossword to be populated in grid
            grid: this.state.boxes.map(
                row => row.map(
                    box => box.fillType === SquareType.BLACK ? "." : box.letter)),
            clues: {
                across: across,
                down: down,
            },
            circles: "",
        };
        let buffer : Uint8Array = Puz.encode(puzzle);
        let printable = "";
        buffer.forEach(i => {
            if (i >= 32) {
                printable += String.fromCharCode(i);
            } else if (i === 0) {
                printable += "\\0\n";
            } else {
                printable += "<" + i + ">";
            }
        });
        console.log(printable);
    }

    onInputBoxChange() {
        let x = this.state.cursor.x;
        let y = this.state.cursor.y;
        if (x < 0 || y < 0 || this.state.boxes[y][x].fillType === SquareType.BLACK || !this.nameInput.current) {
            console.log("Ignoring changeEvent");
            return;
        }

        let pressedKey = this.nameInput.current.value;
        pressedKey = pressedKey.toUpperCase();
        if (pressedKey === " " || pressedKey === "." || pressedKey === "") {
            // Clear the box
            pressedKey = ".";
        } else if (pressedKey > 'Z' || pressedKey < 'A') {
            console.log("Ignoring key " + pressedKey);
            return;
        }
        this.setState(state => {
            let clonedBoxes = cloneDeep(state.boxes);
            clonedBoxes[state.cursor.y][state.cursor.x].letter = pressedKey;
            let clues = cloneDeep(this.state.clues);
            clues.forEach(c => c.setConstraintsFromBoxes(clonedBoxes));
            return {boxes:clonedBoxes, cursor: this.getNextPoint(state.cursor), clues:clues};
        });
    }

    constructor(props: CrosswordProps) {
        super(props);
        if (!props.editable) {
            console.log("To implmenet loading crossword later");
        }
        this.state = this.getStateForSize(15);
    }

    getStateForSize(N: number) {
        let boxes = [];
        for (var i = 0; i < N; i++) {
            let row = []
            for (var j = 0; j < N; j++) {
                row.push({
                    fillType: shouldBeBlack(i,j,N),
                    letter: ".",
                    coords: {y: i, x: j},
                    clueNumber:""});
            }
            boxes.push(row);
        }
        return { 
            boxes: boxes,
            clues: numberClues(boxes),
            cursor:{x: -1, y: -1}, 
            mode: Mode.SOLVE, 
            isAcross: true,
            N: N};
    }

    getHiddenBoxStyle() : CSSProperties {
        if(!this.div.current || this.state.mode === Mode.GRID) {
            return {
                visibility: "collapse",
            };
        }
        let size = this.div.current.clientWidth;
        return {
            left: this.div.current.offsetLeft + size * (this.state.cursor.x / this.state.N),
            top: this.div.current.offsetTop + size * (this.state.cursor.y / this.state.N),
            width: size / this.state.N,
            height: size/ this.state.N,
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
        console.log("Render Crossword");
        return (
        <div ref={this.div} className="crossword" tabIndex={0}>
            <svg 
                onClick={e => this.onClick(e)}
                id="crossword-svg" viewBox={"0 0 " + this.state.N*boxSize + " " + this.state.N*boxSize} xmlns="http://www.w3.org/2000/svg">
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
            <div style={this.hideIfNotEditable()}>
                <Button onClick={e => this.onToggleChange(e)}>{this.state.mode === Mode.SOLVE ? "Edit Grid" : "Solve"}</Button>
                <Button onClick={e => this.onFillButtonClick(e)}>Fill</Button>
                <Button onClick={e => this.setState(state => {
                    let clonedBoxes = cloneBoxes(state.boxes, true, true);
                    return {boxes: clonedBoxes, clues: numberClues(clonedBoxes)}
                })}>Clear</Button>
                <Select value={this.state.N} onChange={e => this.setState(this.getStateForSize(+e.target.value))}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                </Select>
                <Button onClick={e => this.onSave()}>Save</Button>
                <br/>
                <textarea className="extraWords" ref={this.specialWords} />
            </div>
            <input value="" ref={this.nameInput} 
            maxLength={1} 
            onClick={e => {this.setState(state => {
                let clonedBoxes = cloneAndremoveHighlight(state.boxes);
                let isAcross = this.trySetIsAcrossAndHighlight(
                    clonedBoxes, state.clues, !state.isAcross, state.cursor);
                return {isAcross: isAcross, boxes:clonedBoxes}})
            }}
            onChange={e => this.onInputBoxChange()} 
            style={this.getHiddenBoxStyle()}/>
            <div>
                    Across
                <ul className="clueList">
                        {this.state.clues.filter(c => c.isAcross).map(c => {
                            return <li key={c.clueNumber + "A"}>
                                {c.clueNumber}. <Input inputRef={c.clueTextRef} /> ({c.length}) :
                                <Button onClick={e => this.onClueLock(c)}>{c.state.isLocked ? "Unlock" : "Lock"}</Button>
                                 {c.state.constraints}
                            </li>
                    })}
                </ul>
            </div>
            <div>
                Down
                <ul className="clueList">
                    {this.state.clues.filter(c=> !c.isAcross).map(c => {
                        return <li key={c.clueNumber + "D"}>
                        {c.clueNumber}. <Input inputRef={c.clueTextRef} /> ({c.length}) : 
                        <Button onClick={e => this.onClueLock(c)}>{c.state.isLocked ? "Unlock" : "Lock"}</Button>
                {c.state.constraints}
                    </li>
                    })}
                </ul>
            </div>
        </div>);
    }

    onFillButtonClick(ignored: any) {
        let additionalWords : Array<string> = [];
        if (this.specialWords.current) {
            new Set(this.specialWords.current.value.toUpperCase().split(/[^A-Z]/)).forEach(s => additionalWords.push(s));
        }
        let clues = solve(this.state.clues, additionalWords);
        if(clues !== null) {
            let nonNullClues = clues
            let clonedBoxes = cloneAndremoveHighlight(this.state.boxes);
            for(let i=0; i<this.state.N; i++) {
                for(let j=0; j<this.state.N; j++) {
                    clonedBoxes[i][j].letter = "";
                }
            }
            clues.forEach(
                clue => {
                    for (let i=0; i<clue.length; i++) {
                        if(!clue.state.isFilled) {
                            continue;
                        }
                        if(clue.isAcross) {
                            clonedBoxes[clue.start.y][clue.start.x + i].letter = clue.state.constraints.charAt(i);
                        } else {
                            clonedBoxes[clue.start.y + i][clue.start.x].letter = clue.state.constraints.charAt(i);
                        }
                    }
                }
            )
            this.setState(state => {
                return {boxes: clonedBoxes, clues: nonNullClues}
            });
        } else {
            console.log("No solution!");
        }
    }
}

export default Crossword;