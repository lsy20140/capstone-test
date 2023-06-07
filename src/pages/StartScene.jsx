import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StartScene() {

  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/login')}>로그인</button>
      <button onClick={() => navigate('/signup')}>회원가입</button>
      <button onClick={() => navigate('/main')}>메인으로</button>
    </>
  )
}
