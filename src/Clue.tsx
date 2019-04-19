import {BoxProps, SquareType} from "./Square";
import {Point} from "./Crossword";

type ClueType = {
    clueNumber: number,
    start: Point,
    length: number,
    isAcross: boolean,
}

type BacktrackingClueState = {
    isBacktracking: boolean,
    isFilled: boolean,
    constraints: string,
    intersectingClues: Array<Clue>,
}

export class Clue {
    clueNumber: number;
    start: Point;
    length: number;
    isAcross: boolean;
    state: BacktrackingClueState;

    constructor(props: ClueType) {
        this.clueNumber = props.clueNumber;
        this.start = props.start;
        this.length = props.length;
        this.isAcross = props.isAcross;
        let constraints = Array(props.length + 1).join(" ");
        this.state = {
            isBacktracking: false,
            isFilled: false,
            constraints:constraints,
            intersectingClues:[]};
    }

    public getPoints() {
        let points = [];
        for(let i=0; i<this.length; i++) {
            if (this.isAcross) {
                points.push({x:this.start.x + i, y:this.start.y});
            } else {
                points.push({x:this.start.x, y:this.start.y + i});
            }
        }
        return points;
    }

    public contains(point: Point) {
        if (this.isAcross) {
            return (point.y == this.start.y) && (this.start.x <= point.x) && (point.x < this.start.x + this.length);
        } else {
            return (point.x == this.start.x) && (this.start.y <= point.y) && (point.y < this.start.y + this.length);
        }
    }

    public intersects(other: Clue) {
        if (other.isAcross == this.isAcross) {
            return null;
        }
        let across = other.isAcross ? other : this;
        let down = other.isAcross ? this : other;

        let point = {x: down.start.x, y: across.start.y}
        if (across.contains(point) && down.contains(point)) {
            return point;
        }
        return null;
    }

    public setConstraint(i:number, char:string) {
        if(char.length != 1 || i >= this.state.constraints.length) {
            throw new Error(
                "chr length must be 1 and " + i + " < " + this.state.constraints.length
                + " -- " + this.start.x + "," + this.start.y + "(" + this.length + ")" 
                + (this.isAcross? "A" : "D")); 
        }

        let oldConstraint = this.state.constraints;
        let oldN = oldConstraint.length;
        this.state.constraints = oldConstraint.substr(0,i) + char + oldConstraint.substr(i+1);
        console.log(this.start.x + "," + this.start.y + "(" + this.length + ")" 
        + (this.isAcross? "A" : "D") + "\n" + oldN + " -> " + this.state.constraints.length);
    }
}


export function numberClues(boxes: Array<Array<BoxProps>>): Array<Clue> {
    let N = boxes.length;
    let clues : Array<Clue> = [];

    let currentClue : Clue | null = null;

    function goThrough(i: number, j: number, isAcross: boolean) {
        if (i == N || j == N) {
            if(currentClue != null) {
                clues.push(currentClue)
            }
            currentClue = null;
            return;
        }
        if(boxes[i][j].fillType != SquareType.BLACK) {
            if (currentClue == null) {
                currentClue = new Clue({start:{x:j, y:i}, isAcross: isAcross, length: 1, clueNumber: 0});
            } else {
                currentClue.length++;
            }
        } else {
            if(currentClue != null) {
                clues.push(currentClue)
            }
            currentClue = null;
        }
    }

    for(var i=0; i<N; i++) {
        for(var j=0; j<N; j++) {
            boxes[i][j].clueNumber = "";
        }
    }
    for(var i=0; i<N; i++) {
        for(var j=0; j<N+1; j++) {
            goThrough(i, j, true);
        }
    }

    for(var i=0; i<N; i++) {
        for(var j=0; j<N+1; j++) {
            goThrough(j, i, false);
        }
    }
    let singleLengthClues = clues
        .filter(clue => clue.length == 1)

    let setOfSingleLengthClueStarts = new Set();

    singleLengthClues.forEach(start => {
        if (setOfSingleLengthClueStarts.has(start)) {
            console.log("Duplicate");
            return [];
        }
        setOfSingleLengthClueStarts.add(start);
    });

    let actualClues = clues.filter(clue => clue.length > 1)
        .sort((c1,c2) => c1.start.x + N*c1.start.y - c2.start.x - c2.start.y*N);
    let clueNumber = 0;
    for (let i=0; i<actualClues.length; i++) {
        let clue = actualClues[i];
        if (boxes[clue.start.y][clue.start.x].clueNumber == "") {
            clueNumber++;
            boxes[clue.start.y][clue.start.x].clueNumber = "" + clueNumber;
        }
        clue.clueNumber = clueNumber;
    }
    console.log(actualClues);
    return actualClues;
}