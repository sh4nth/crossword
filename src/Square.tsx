import React, { Component } from 'react';
import { Point } from './Crossword';


export type BoxProps = {
    coords: Point
    letter: string
    clueNumber: string
    fillType: SquareType
}

export enum SquareType {
    BLACK = "blackSquare",
    WHITE = "whiteSquare",
    ACTIVE = "highlightSquare",
}

export const boxSize = 40;

export class Square extends Component<BoxProps, {}> {
    pointToIdString(prefix:string) {
        return prefix + this.props.coords.x + "-" + this.props.coords.y;
    }
    
    constructor(props: BoxProps) {
        super(props);
    }

    public render() {
        let svgElements = [];
        svgElements.push(
            <rect
                key={this.pointToIdString("box")}
                x={this.props.coords.x * boxSize}
                y={this.props.coords.y * boxSize}
                width={boxSize}
                height={boxSize}
                className={this.props.fillType}>
            </rect>);
        if (this.props.fillType) {
            svgElements.push(
                <text
                    key={this.pointToIdString("text")}
                    x={(this.props.coords.x + 0.35) * boxSize}
                    y={(this.props.coords.y + 0.65) * boxSize}
                    className="clueText">{this.props.letter}
                </text>);
            if (this.props.clueNumber != "") {
                svgElements.push(
                    <text
                        key={this.pointToIdString("clue")}
                        x={this.props.coords.x * boxSize + 2}
                        y={this.props.coords.y * boxSize + 10}
                        className="clueNumber">{this.props.clueNumber}
                    </text>);
            }
        }
        return (<g key={this.pointToIdString("group")}>{svgElements}</g>);
    }
}
