import {BoxProps, SquareType} from "./Square";
import {Point} from "./Crossword";

type ClueType = {
    clueNumber: number,
    start: Point,
    length: number,
    isAcross: boolean, 
}

export class Clue {
    clueNumber: number;
    start: Point;
    length: number;
    isAcross: boolean;

    constructor(props: ClueType) {
        this.clueNumber = props.clueNumber;
        this.start = props.start;
        this.length = props.length;
        this.isAcross = props.isAcross;
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
    console.log("-----------");
    for (let i=0; i<actualClues.length; i++) {
        let clue = actualClues[i];
        console.log("Start");
        console.log(clue);
        if (boxes[clue.start.y][clue.start.x].clueNumber == "") {
            clueNumber++;
            boxes[clue.start.y][clue.start.x].clueNumber = "" + clueNumber;
        }
        clue.clueNumber = clueNumber;
    }
    console.log(actualClues);
    return actualClues;
}