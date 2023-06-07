import React, { useEffect, useState } from 'react'
import userList from '../db/userList.json'
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  
  function checkUser(user){
    Object.entries(userList).forEach((item) => {
      if((item.username === user.username) && (item.password === user.password)){
        return "fdfd"
      }
      else{
        return "nonon"
      }
      
    })
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setUser((user) =>({...user, [name]: value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user.username)
    console.log(Object.entries(userList))
    console.log(typeof(userList[0].username))
  }


  return (
    <>
      <h2>Login Page</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='username'>아이디<span> *</span></label><br/>  
          <input 
            type='text' 
            id='username' 
            name='username' 
            value={user.username ?? ''}
            placeholder='아이디 입력' 
            onChange={handleChange}
            required/><br/>  

          <label htmlFor='password'>비밀번호<span> *</span></label><br/>  
          <input 
            type='text' 
            id='password' 
            name='password' 
            value={user.password ?? ''}
            placeholder='비밀번호 입력' 
            onChange={handleChange}
            required/><br/>  
            <button>로그인</button>
        </form>
      </div>
      
    </>
  )
}
