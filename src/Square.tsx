import React, { Component, CSSProperties, SVGAttributes } from 'react';


export type State = {
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

export class Square extends Component<{}, State> {
    constructor(props: State) {
        super(props);
        this.state = props;
    }


    render() {
        let svgElements = [];
        svgElements.push(<rect x={this.state.x * boxSize} y={this.state.y * boxSize} width={boxSize} height={boxSize} style={getStyle(this.state.fillable)}></rect>);
        if (this.state.fillable) {
            svgElements.push(<text x={(this.state.x + 0.35) * boxSize} y={(this.state.y + 0.65) * boxSize} style={textStyle}>{this.state.letter}</text>);
            if (this.state.clueNumber != "") {
                svgElements.push(<text x={this.state.x * boxSize + 2} y={this.state.y * boxSize + 10} style={clueStyle}>{this.state.clueNumber}</text>);
            }
        }
        return (<g key={this.state.id}>{svgElements}</g>);
    }
}
