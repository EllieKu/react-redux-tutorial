import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { selectPostById, updatePost, deletePost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  
  const post = useSelector(state => selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setUserId] = useState(post?.userId)
  const [requestStatus, setRequestStatus] = useState("idle")

  const dispatch = useDispatch(
    updatePost({
      ...post,
      title,
      body: content,
      userId,
    })
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    )
  }
  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending")
        dispatch(
          updatePost({
            ...post,
            title,
            body: content,
            userId: Number(userId)
          })
        )
        setTitle("")
        setContent("")
        setUserId("")
        navigate(`/post/${postId}`)
      } catch (error) {
        console.error('Fail to save the post', error)
      } finally {
        setRequestStatus("idle")
      }
    }
  }

  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending")
      dispatch(
        deletePost({ id: post.id })
      )
      setTitle("")
      setContent("")
      setUserId("")
      navigate("/")
    } catch (error) {
      console.error('Fail to delete the post', error)
    } finally {
      setRequestStatus("idle")
    }
  }

  const usersOptions = users.map(user => (
    <option
      key={user.id}
      value={user.id}
    >
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={onAuthorChange}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChange}
        />
        <button
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
        >
          Save Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  )
}

export default EditPostForm