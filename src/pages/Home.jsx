import React, { Component } from 'react';
import Particles from 'react-particles-js';

const ParticlesOpt = {
    particles: {
        number: {
            value: 450,
            density: {
                enable: true,
                value_arena: 100
            }
        }
    }
}
class Home extends Component {
    render(){
        return(
            <div style={{backgroundColor: "black"}}>
                
                <div 
                    style={{
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    Welcome to the International Trade Analytical Website sponsed by LeFanucaNoobinho's skills
                </div>

                <Particles 
                    params={ParticlesOpt} 
                />
            </div>
        )
    }
}

export default Home