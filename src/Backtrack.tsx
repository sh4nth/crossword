import { Clue } from "./Clue";
import { words2 } from "./words/w02";
import { words3 } from "./words/w03";
import { words4 } from "./words/w04";
import { words5 } from "./words/w05";
import { words6 } from "./words/w06";
import { words7 } from "./words/w07";
import { words8 } from "./words/w08";
import { words9 } from "./words/w09";
import { words10 } from "./words/w10";
import { words11 } from "./words/w11";
import { words12 } from "./words/w12";
import { words13 } from "./words/w13";
import { words14 } from "./words/w14";
import { words15 } from "./words/w15";

function updateConstraintsAndCheckIsValid(clues: Array<Clue>) {
    for(let i=0; i<clues.length; i++) {
        let clue = clues[i];
        if (!clue.state.isFilled) {
            clue.clearConstraints();
        }
        for(let j=0; j<clue.state.intersectingClues.length; j++) {
            let clue2 = clue.state.intersectingClues[j];
            if(!clue.state.isFilled && !clue2.state.isFilled) {
                continue;
            }
            let across = clue.isAcross ? clue : clue2;
            let down = clue.isAcross ? clue2 : clue;

            let a_intersect = 
                across.state.constraints.charAt(down.start.x - across.start.x);
            let d_intersect = 
                down.state.constraints.charAt(across.start.y - down.start.y);
            if (!across.state.isFilled) {
                across.setConstraint(down.start.x - across.start.x, d_intersect);
            }
            if (!down.state.isFilled) {
                down.setConstraint(across.start.y - down.start.y,  a_intersect);
            }
            if (across.state.isFilled && down.state.isFilled && a_intersect !== d_intersect) {
                return false;
            }
        }
    }
    return true;
}


function initForBackTracking(clues: Array<Clue>) {
    console.log("InBacktr");
    for(let i=0; i<clues.length; i++) {
        let clue = clues[i];
        if (!clue.state.isLocked) {
            clue.clearConstraints();
            clue.state.isBacktracking = true;
            clue.state.isFilled = false;
        }
        // clue.state.intersectingClues = [];
    }
}

let totalTries = 0;
let MAX_TRIES = 3000;

export function solve(clues : Array<Clue>, additionalWords: Array<string>) {
    totalTries = 0;
    initForBackTracking(clues);
    updateConstraintsAndCheckIsValid(clues);
    for (let i=2; i<=15; i++) {
        wordsByLength[i] = additionalWords.filter(w => w.length === i).concat(dictsByLength[i]);
    }
    let usedWords = new Set<string>();
    clues.filter(c => c.state.isFilled).map(c => c.state.constraints).forEach(w => usedWords.add(w));
    console.log(usedWords);
    return fill(clues, usedWords, 0);
}

function fill(clues : Array<Clue>, words:Set<string>, depth:number): Array<Clue> | null {
    totalTries += 1;
    updateConstraintsAndCheckIsValid(clues);

    if(totalTries > MAX_TRIES) {
        return clues;
    }

    if (depth > 80) {
        throw new Error("Recursion depth");
    }
    let n = clues.filter(c => c.state.isFilled).length;
    console.log("Solved " + n + " of " + clues.length);
    console.log(clues.map(c=>c.state.constraints));
    let unsolved = clues.filter(c => !c.state.isFilled);

    // Try to solve more constrained words first
    unsolved.sort((c1, c2) => {
        let n1 = c1.state.intersectingClues.filter(c=> c.state.isFilled).length;
        let n2 = c2.state.intersectingClues.filter(c=> c.state.isFilled).length;
        return n2 - n1;
    });

    if (unsolved.length === 0) {
        return clues;
    }
    
    for (let i =0; i<unsolved.length; i++) {
        let clue = unsolved[i];
        let guess = find(clue, words, 0);
        if (guess == null) {
            console.log("stuck on " + clue.clueNumber + (clue.isAcross? "A" : "D")); 
            return null;
        }
    }


    for (let i=0; i<unsolved.length; i++) {
        let clue = unsolved[i];
        let guess = find(clue, words, 0);
        while (guess != null) {
            // TODO Make guess return index and guess to continue searches correctly
            words.add(guess.word);
            clue.state.constraints = guess.word;
            clue.state.isFilled = true;
            updateConstraintsAndCheckIsValid(clues);
            let rec = fill(clues, words, depth + 1);
            if (rec != null) {
                return rec;
            }
            clue.state.isFilled = false;
            words.delete(guess.word);
            updateConstraintsAndCheckIsValid(clues);
            guess = find(clue, words, guess.index+1);
            if (guess === null) {
                console.log("stuck on " + clue.clueNumber + (clue.isAcross? "A" : "D")); 
            }
        }
    }
    return null;
}

type Guess = {
    index: number,
    word: string,
} | null;

let wordsByLength : Array<Array<string>> = Array(16);
let dictsByLength : Array<Array<string>> = Array(16);
for (let i=0; i<=15; i++) {
    dictsByLength[i] = [];
}

dictsByLength[2] = words2;
dictsByLength[3] = words3;
dictsByLength[4] = words4;
dictsByLength[5] = words5;
dictsByLength[6] = words6;
dictsByLength[7] = words7;
dictsByLength[8] = words8;
dictsByLength[9] = words9;
dictsByLength[10] = words10;
dictsByLength[11] = words11;
dictsByLength[12] = words12;
dictsByLength[13] = words13;
dictsByLength[14] = words14;
dictsByLength[15] = words15;

function find(clue:Clue, usedWords:Set<string>, start:number) : Guess {
    let words = wordsByLength[clue.length];
    for(let i=start; i <words.length; i++) {
        if (usedWords.has(words[i])) {
            continue;
        }
        if (matches(clue.state.constraints, words[i])) {
            return {index: i, word:words[i]};
        }
    }
    return null;
}

function matches(constr: string, word:string) {
    return word.search(constr) !== -1;
}