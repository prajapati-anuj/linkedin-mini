import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    const url = isRegistering ? 'http://localhost:5000/register' : 'http://localhost:5000/login'
    try {
      const res = await axios.post(url, {
        name,
        email,
        password
      })
      if (!isRegistering) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push('/feed')
      } else {
        alert('Registration successful. You can now login.')
        setIsRegistering(false)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      {isRegistering && (
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}
      <br />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>
        {isRegistering ? 'Register' : 'Login'}
      </button>
      <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', color: 'blue' }}>
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </p>
    </div>
  )

  
}
