import React, { Component } from 'react';
import Particles from 'react-particles-js';

const ParticlesOpt = {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_arena: 100
            }
        }
        
    }, interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            }
        }
    }
}

class Home extends Component {
    render(){
        return(
            <div style={{backgroundColor: "rgb(110, 15, 17)", height: 'calc(100vh - 60px)'}}>
                
                <div className='homePageTitle'
                    style={{
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    International Trade Analysis
                </div>

                <Particles 
                    height='calc(100vh - 70px)'
                    params={ParticlesOpt} 
                />
            </div>
        )
    }
}

export default Home