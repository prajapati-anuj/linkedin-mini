import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function MyProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchProfile(parsed.id)
  }, [])

  const fetchProfile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/profile/${id}`)
      setProfile(res.data)
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>My Profile</h1>
      {profile ? (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio yet.'}</p>

          <h3 style={{ marginTop: 20 }}>My Posts</h3>
          {profile.posts.length === 0 && <p>You haven’t posted anything yet.</p>}
          {profile.posts.map((post, i) => (
            <div key={i} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
              <small>{new Date(post.timestamp).toLocaleString()}</small>
              <p>{post.content}</p>
            </div>
          ))}
        </>
      ) : <p>Loading...</p>}
    </div>
  )
}
