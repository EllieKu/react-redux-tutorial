import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
  posts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
}

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  () => axios.get(POSTS_URL)
    .then(response => response.data)
    .catch(error => error.message)
)

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  (initialPost) => axios.post(POSTS_URL, initialPost)
    .then(response => response.data)
    .catch(error => error.message)
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  (initialPost) => {
    const { id } = initialPost
    return axios.put(`${POSTS_URL}/${id}`, initialPost)
      .then(response => response.data)
      .catch(error => {
        // return error.message // only for testing Redux!
        return initialPost
      })
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  ({ id }) => {
    return axios.delete(`${POSTS_URL}/${id}`)
      .then(response => {
        if (response?.status === 200) {
          return id
        }
        return `${response.status}: ${response.statusText}`
      })
      .catch(error => error.message)
    }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0
            }
          }
        }
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload

      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction] += 1
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        let min = 1
        const loadedPosts = action.payload.map(post => ({
          ...post,
          date: sub(new Date(), { minutes: min++ }).toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
        }))

        state.posts = loadedPosts
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const body = {
          ...action.payload,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
        }
        state.posts.push(body)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id } = action.payload

        if(!id) {
          console.log('Update could not complete')
          console.log(action.payload)
          return
        }

        const body = {
          ...action.payload,
          date: new Date().toISOString(),
        }
        const newPosts = state.posts.map(post => post.id === id ? body : post)
        state.posts = newPosts
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const id = action.payload

        if(!id) {
          console.log('Delete could not complete')
          console.log(action.payload)
          return
        }
        const newPosts = state.posts.filter(post => post.id !== id)
        state.posts = newPosts
      })
  },
})

export const selectAllPosts = (state) => state.posts.posts
export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)
export const getPostStatus = (state) => state.posts.status
export const getPostError = (state) => state.posts.error

export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer