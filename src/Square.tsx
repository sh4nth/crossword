import React, { Component, CSSProperties, SVGAttributes, KeyboardEvent } from 'react';


export type BoxProps = {
    x: number
    y: number
    id: string
    letter: string
    clueNumber: string
    fillable: boolean
}

type State = {
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
export class Square extends Component<BoxProps, {}> {
    constructor(props: BoxProps) {
        super(props);
        console.log("Construct <" + this.props.letter + ">");
    }

    // public onClick() {
    //     this.setState((state) => {
    //         return { fillable: !state.fillable };
    //     });
    // }

    public render() {
        console.log("Render " + this.props.id + " with " + this.props.letter);
        let svgElements = [];
        svgElements.push(
            <rect
            key={"box" + this.props.id}
                x={this.props.x * boxSize}
                y={this.props.y * boxSize}
                width={boxSize}
                height={boxSize}
                style={getStyle(this.props.fillable)}>
            </rect>);
        if (this.props.fillable) {
            svgElements.push(
                <text
                    key={"letter" + this.props.id}
                    x={(this.props.x + 0.35) * boxSize}
                    y={(this.props.y + 0.65) * boxSize}
                    style={textStyle}>{this.props.letter}
                </text>);
            if (this.props.clueNumber != "") {
                svgElements.push(
                    <text
                        key={"clue" + this.props.id}
                        x={this.props.x * boxSize + 2}
                        y={this.props.y * boxSize + 10}
                        style={clueStyle}>{this.props.clueNumber}
                    </text>);
            }
        }
        return (<g key={this.props.id}>{svgElements}</g>);
    }
}
