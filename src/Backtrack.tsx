import { Clue } from "./Clue";

function updateConstraintsAndCheckIsValid(clues: Array<Clue>) {
    for(let i=0; i<clues.length; i++) {
        let clue = clues[i];
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
                console.log(across.state.constraints + ":" + d_intersect);
                across.setConstraint(down.start.x - across.start.x, d_intersect);
                console.log(across.state.constraints + ":" + d_intersect);
            }
            if (!down.state.isFilled) {
                down.setConstraint(across.start.y - down.start.y,  a_intersect);
            }
            if (across.state.isFilled && down.state.isFilled && a_intersect != d_intersect) {
                return false;
            }
        }
    }
    return true;
}


function initForBackTracking(clues: Array<Clue>) {
    console.log("InBacktr");
    console.log(clues);
    for(let i=0; i<clues.length; i++) {
        clues[i].state.constraints = Array(clues[i].length + 1).join(" ");
        clues[i].state.isBacktracking = true;
        clues[i].state.isFilled = false;
        clues[i].state.intersectingClues = [];
    }

    for(let i=0; i<clues.length; i++) {
        for(let j=i+1; j<clues.length; j++) {
            let c1 = clues[i];
            let c2 = clues[j];
            if (!c1.state || !c2.state) {
                throw Error("Just set above");
            }
            if (c1.intersects(c2)) {
                c1.state.intersectingClues.push(c2);
                c2.state.intersectingClues.push(c1);
            }
        }
    }
}

export function solve(clues : Array<Clue>) {
    initForBackTracking(clues);
    return fill(clues, new Set());
}

function fill(clues : Array<Clue>, words:Set<string>): Array<Clue> | null {
    let n = clues.filter(c => c.state.isFilled).length;
    console.log("Solved " + n + " of " + clues.length);
    let unsolved = clues.filter(c => !c.state.isFilled);


    if (unsolved.length == 0) {
        console.log("Yay!");
        console.log(clues);
        return clues;
    }
    
    for (let i =0; i<unsolved.length; i++) {
        let clue = unsolved[i];
        let guess = find(clue, words, 0);
        if (guess == null) {
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
            let rec = fill(clues, words);
            if (rec != null) {
                return rec;
            }
            clue.state.isFilled = false;
            words.delete(guess.word);
            updateConstraintsAndCheckIsValid(clues);
            guess = find(clue, words, guess.index+1);
        }
    }
    return null;
}

type Guess = {
    index: number,
    word: string,
}

// TODO: Fix this to load from a dictionary
let words = [
    "AAAAA", 
    "ABBBB", 
    "ACCCC", 
    "ADDDD", 
    "BXCXD", 
    "BYCYD",
    "BX",
    "XD",
    "BB",
    "AB",
];

function find(clue:Clue, usedWords:Set<string>, start:number) {
    for(let i=start; i < words.length; i++) {
        if (usedWords.has(words[i]) || words[i].length != clue.length) {
            continue;
        }
        if (matches(clue.state.constraints, words[i])) {
            return {index: i, word:words[i]};
        }
    }
    return null;
}

function matches(constr: string, word:string) {
    for (let i=0; i<constr.length; i++) {
        if (constr.charAt(i) != " " && constr.charAt(i) != word.charAt(i)) {
            return false;
        }
    }
    return true;
}