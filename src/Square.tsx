import React, { Component, CSSProperties, SVGAttributes } from 'react';


export type State = {
    x: number
    y: number
    id: string
    letter: string
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
        if (this.state.fillable) {
            return (<g key={this.state.id} id={this.state.id}>
                <rect x={this.state.x * boxSize} y={this.state.y * boxSize} width={boxSize} height={boxSize} style={getStyle(this.state.fillable)}></rect>
                <text x={this.state.x * boxSize + 2} y={this.state.y * boxSize + 10} style={clueStyle}>{(this.state.x + this.state.y) % 30}</text>
                <text x={(this.state.x + 0.35) * boxSize} y={(this.state.y + 0.65) * boxSize} style={textStyle}>{this.state.letter}</text>
            </g>);
        }
        return (<g key={this.state.id} id={this.state.id}>
            <rect x={this.state.x * boxSize} y={this.state.y * boxSize} width={boxSize} height={boxSize} style={getStyle(this.state.fillable)}></rect>
        </g>);
    }
}
