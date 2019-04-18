import {BoxProps} from "./Square";
import {Point} from "./Crossword";
import {cloneDeep} from "lodash";

type Clue = {
    clueNumber: number,
    start: Point,
    length: number,
    isAcross: boolean, 
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
        if(boxes[i][j].fillable) {
            if (currentClue == null) {
                currentClue = {start:{x:j, y:i}, isAcross: isAcross, length: 1, clueNumber: 0};
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
    let clueNumber = 1;
    console.log("-----------");
    for (let i=0; i<actualClues.length; i++) {
        let clue = actualClues[i];
        console.log("Start");
        console.log(clue);
        if (boxes[clue.start.y][clue.start.x].clueNumber == "") {
            boxes[clue.start.y][clue.start.x].clueNumber = "" + clueNumber++;
        }
        clue.clueNumber = clueNumber;
    }
    console.log(clues);
    return clues;
}