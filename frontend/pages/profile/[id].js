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

  if (!profile) return <p style={{ textAlign: 'center', marginTop: 100 }}>Loading profile...</p>

  return (
    <div style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: '#6b829fff',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{profile.name}'s Profile</h1>
      <p style={{ margin: '8px 0' }}><strong>Email:</strong> {profile.email || 'Not provided'}</p>
      <p style={{ margin: '8px 0', fontStyle: 'italic', color: '#555' }}><strong>Bio:</strong> {profile.bio || 'No bio yet.'}</p>

      <hr style={{ margin: '30px 0' }} />

      <h2 style={{ marginBottom: '20px' }}>Posts</h2>
      {profile.posts.length === 0 ? (
        <p style={{ color: '#888' }}>You haven’t posted anything yet.</p>
      ) : (
        profile.posts.map((post, i) => (
          <div key={i} style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '8px',
            backgroundColor: '#282121ff'
          }}>
            <small style={{ color: '#999' }}>{new Date(post.timestamp).toLocaleString()}</small>
            <p style={{ marginTop: '8px' }}>{post.content}</p>
          </div>
        ))
      )}

      <button
        onClick={() => router.push('/feed')}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#0073b1',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ← Back to Feed
      </button>
    </div>
  )
}
