import React, { Component, CSSProperties, SVGAttributes, KeyboardEvent } from 'react';


export type BoxState = {
    x: number
    y: number
    id: string
    letter: string
    clueNumber: string
    fillable: boolean
}

export const boxSize = 40;

export function getStyle(fillable: boolean): CSSProperties {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fill: fillable ? "white" : "black",
        stroke: 'rgb(55,55,55)',
        strokeWidth: 1,
    };
}

const clueStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fill: 'black',
    fontSize: '10px',
};

const textStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fill: 'black',
    fontSize: '20px'
};
const groupStyle = {
    pointerEvents: 'bounding-box'
};
export class Square extends Component<BoxState, BoxState> {
    constructor(props: BoxState) {
        super(props);
        this.state = {
            x: props.x,
            y: props.y,
            id: props.id,
            letter: props.letter,
            clueNumber: props.clueNumber,
            fillable: props.fillable,
        };
    }

    public onClick() {
        this.setState((state) => {
            return { fillable: !state.fillable };
        });
    }

    public render() {
        let svgElements = [];
        svgElements.push(
            <rect
            key={"box" + this.state.id}
                onClick={(e) => this.onClick()}
                x={this.state.x * boxSize}
                y={this.state.y * boxSize}
                width={boxSize}
                height={boxSize}
                style={getStyle(this.state.fillable)}>
            </rect>);
        if (this.state.fillable) {
            svgElements.push(
                <text
                    key={"letter" + this.state.id}
                    onClick={(e) => this.onClick()}
                    x={(this.state.x + 0.35) * boxSize}
                    y={(this.state.y + 0.65) * boxSize}
                    style={textStyle}>{this.state.letter}
                </text>);
            if (this.state.clueNumber != "") {
                svgElements.push(
                    <text
                        key={"clue" + this.state.id}
                        onClick={(e) => this.onClick()}
                        x={this.state.x * boxSize + 2}
                        y={this.state.y * boxSize + 10}
                        style={clueStyle}>{this.state.clueNumber}
                    </text>);
            }
        }
        return (<g key={this.state.id}>{svgElements}</g>);
    }
}
