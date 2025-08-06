import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/posts')
    const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setPosts(sorted)
  }

  const createPost = async () => {
    if (!content.trim()) return
    await axios.post('http://localhost:5000/posts', {
      user_id: user.id,
      content
    })
    setContent('')
    fetchPosts()
  }

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
        Welcome, {user?.name}
      </h1>

      {/* Post Composer */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '30px'
      }}>
        <textarea
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '1rem',
            resize: 'none',
            outline: 'none'
          }}
        />
        <button
          onClick={createPost}
          style={{
            marginTop: '10px',
            backgroundColor: '#0073b1',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Post
        </button>
      </div>

      {/* Feed */}
      <h2 style={{ marginBottom: '20px' }}>Recent Posts</h2>
      {posts.map((post, i) => (
        <div key={i} style={{
          backgroundColor: '#454848d1',
          border: '1px solid #eee',
          borderRadius: '10px',
          padding: '15px 20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px #00000008'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>
              <a
                href={`/profile/${post.user_id}`}
                style={{
                  color: '#0073b1',
                  textDecoration: 'none'
                }}
              >
                {post.author_name}
              </a>
            </strong>
            <span style={{ marginLeft: '8px', color: '#00000008', fontSize: '0.9rem' }}>
              • {new Date(post.timestamp).toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
