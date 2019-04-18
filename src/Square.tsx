import React, { Component, CSSProperties, SVGAttributes, KeyboardEvent } from 'react';


export type BoxProps = {
    x: number
    y: number
    id: string
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

const groupStyle = {
    pointerEvents: 'bounding-box'
};
export class Square extends Component<BoxProps, {}> {
    constructor(props: BoxProps) {
        super(props);
        console.log("Construct <" + this.props.letter + ">");
    }

    public render() {
        let svgElements = [];
        svgElements.push(
            <rect
            key={"box" + this.props.id}
                x={this.props.x * boxSize}
                y={this.props.y * boxSize}
                width={boxSize}
                height={boxSize}
                className={this.props.fillType}>
            </rect>);
        if (this.props.fillType) {
            svgElements.push(
                <text
                    key={"letter" + this.props.id}
                    x={(this.props.x + 0.35) * boxSize}
                    y={(this.props.y + 0.65) * boxSize}
                    className="clueText">{this.props.letter}
                </text>);
            if (this.props.clueNumber != "") {
                svgElements.push(
                    <text
                        key={"clue" + this.props.id}
                        x={this.props.x * boxSize + 2}
                        y={this.props.y * boxSize + 10}
                        className="clueNumber">{this.props.clueNumber}
                    </text>);
            }
        }
        return (<g key={this.props.id}>{svgElements}</g>);
    }
}
