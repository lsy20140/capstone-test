import { Environment, Sphere, Box } from '@react-three/drei'
import { Gradient, LayerMaterial } from 'lamina'
import React from 'react'
import * as THREE from 'three'

export default function MainBackground() {
  const colorA = "#aec7da";
  const colorB = "#e8cfc8";
  const start = 0.2;
  const end = 0;

  return (
    <>
      <Sphere scale={[400, 400, 400]}>
        <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
          <Gradient
            colorA={colorA}
            colorB={colorB}
            axes={"y"}
            start={start}
            end={end}
          />
        </LayerMaterial>
      </Sphere>
      <Environment resolution={256}>
        <Sphere
          scale={[100, 100, 100]}
          rotation-y={Math.PI / 2}
          rotation-x={Math.PI} // 구름 아래 부분이 어둡게 보여 자연스러움
        >
          <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
            <Gradient
              colorA={colorA}
              colorB={colorB}
              axes={"y"}
              start={start}
              end={end}
            />
          </LayerMaterial>
        </Sphere>
      </Environment>
      <group>
        <Box position={[0, 0, 0]} args={[150, 1, 150]} >
          <meshStandardMaterial color="#babf39" />
        </Box>
      </group>
      

    </>
  )
}
