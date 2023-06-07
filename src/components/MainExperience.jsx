import React, { useEffect, useMemo, useRef } from 'react'
import MainBackground from './MainBackground'
import * as THREE from 'three'
import { Vector3, Group } from 'three'

import {PerspectiveCamera, useScroll, Box, OrbitControls} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { House2 } from './House2'
import { House1 } from './House1'



const LINE_NB_POINTS = 1000
const CURVE_DISTANCE = 10
const CURVE_AHEAD_CAMERA = 0.008
const CAMERA_MAX_ANGLE = 35

const FRICTION_DISTANCE = 42


export default function MainExperience() {

  // curvePoints
  const curvePoints = useMemo(() => [
    new THREE.Vector3(3*CURVE_DISTANCE,0,3*CURVE_DISTANCE),
    new THREE.Vector3(5*CURVE_DISTANCE,0,0),
    new THREE.Vector3(3*CURVE_DISTANCE,0,-3*CURVE_DISTANCE),
    new THREE.Vector3(0,0,-5*CURVE_DISTANCE),
    new THREE.Vector3(-3*CURVE_DISTANCE,0,-3*CURVE_DISTANCE),
    new THREE.Vector3(-5*CURVE_DISTANCE,0,0),
    new THREE.Vector3(0,0,0),

  ],[])

  // 경로 생성
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvePoints,
      false, 
      "catmullrom",
      1
    )
  },[])

  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, -1)
    shape.lineTo(0, 1)

    return shape
  }, [curve])

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0)

  useFrame((_state, delta) => {    
    const scrollOffset = Math.max(0, scroll.offset)

    let friction = 1 // 느리게 X
    let resetCameraRail = true;
    // // 가까운 textSections 보기
    // textSections.forEach((textSection) => {
    //   const distance = textSection.position.distanceTo(cameraGroup.current.position)
    //   console.log("distance", distance)

    //   if(distance < FRICTION_DISTANCE) {
    //     friction = Math.max(distance / FRICTION_DISTANCE, 0.1)
    //     const targetCameraRailPosition = new Vector3(
    //       (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
    //       0,
    //       0
    //     );
    //     cameraRail.current.position.lerp(targetCameraRailPosition, delta)
    //     resetCameraRail = false
    //   }
    // })
    
    if(resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0,0,0)
      cameraRail.current.position.lerp(targetCameraRailPosition, delta)
    }

    // Lerped Scroll offset 계산
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current, 
      scrollOffset, 
      delta*friction
    )

    // 0 이하, 1 이상인 경우 제한
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1)
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0)

    lastScroll.current = lerpedScrollOffset
    
    const curPoint = curve.getPoint(lerpedScrollOffset)

    // Follow the curve Points
    cameraGroup.current.position.lerp(curPoint, delta*24)

    // Make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(Math.min(scrollOffset +  CURVE_AHEAD_CAMERA, 1))

    const currentLookAt = cameraGroup.current.getWorldDirection(new THREE.Vector3())

    const targetLookAt = new THREE.Vector3().subVectors(curPoint, lookAtPoint).normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24)
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    )  

    // Bird Object Rotation

    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_CAMERA)

    const nonLeprLookAt = new Group();
    nonLeprLookAt.position.copy(curPoint)
    nonLeprLookAt.lookAt(nonLeprLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLeprLookAt.rotation.y
    )

    let angle = Math.atan2(-tangent.z, tangent.x) 
    angle = -Math.PI / 2 + angle

    let angleDegrees = (angle * 180) / Math.PI
    angleDegrees *= 2.4

    // Limit Bird Angle

    if(angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -CAMERA_MAX_ANGLE)
    }
    if(angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, CAMERA_MAX_ANGLE)
    }

    // Set Back Angle
    angle = (angleDegrees * Math.PI) / 180

    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
        cameraGroup.current.rotation.y,
        angle,
      )
    )

    cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2)    
  })



  return (
    <>
    {/* <OrbitControls/> */}
    <directionalLight position={[0, 3, 1]} intensity={0.5} />

      {/* <group position={[3*CURVE_DISTANCE,1,3*CURVE_DISTANCE]}>
        <mesh>
          <extrudeGeometry
            args={[
              shape, 
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              }
            ]} />
            <meshStandardMaterial color={"red"} opacity={1} transparent/>
        </mesh>
      </group> */}

      <group ref={cameraGroup}>
        <MainBackground/>

        <group ref={cameraRail}>
          <PerspectiveCamera position={[4*CURVE_DISTANCE,5,1*CURVE_DISTANCE]} fov={45} makeDefault />
        </group>
      </group>
      <House1
          opacity={1} 
          scale={[15,15,15]}
          position={[95,2, 15]} 
          rotation-y={-1}
        />
        <House2
          opacity={1} 
          scale={[30,30,30]}
          position={[55, 0, -18]} 
          rotation-y={-0.7}
        />
        
        <House2
          opacity={1} 
          scale={[30,30,30]}
          position={[20, 0, -27]} 
          rotation-y={0.3}
        />   

        <House2
          opacity={1} 
          scale={[30,30,30]}
          position={[-30, 0, 25]} 
          rotation-y={1.7}
        />

   </>
  )
}
