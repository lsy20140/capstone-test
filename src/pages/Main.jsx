import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import MainExperience from '../components/MainExperience'


export default function Main() {
  return (
    <>
      <Canvas>
        <axesHelper scale={100} position={[0,5, 0]}/>
        <color attach="background" arg={["#f59f9f"]} />
        <ScrollControls pages={20} damping={1}>
          <MainExperience/>
        </ScrollControls>
      </Canvas>
    </>
  )
}
