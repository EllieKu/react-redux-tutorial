import { useSelector } from "react-redux"
import { selectAllPosts, getPostStatus, getPostError } from "./postsSlice"
import PostsExcerpt from "./PostsExcerpt"

const PostsList = () => {
  const posts = useSelector(selectAllPosts)
  const postStatus = useSelector(getPostStatus)
  const postError = useSelector(getPostError)

  let content;
  if (postStatus === 'loading') {
    content = <p>"Loading..."</p>
  } else if (postStatus === 'succeeded') {
    const orderedPost = posts.map(post => post).sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPost.map(post => <PostsExcerpt key={post.id} post={post}/>)
  } else if (postStatus === 'failed') {
    content = <p>{postError}</p>
  }


  return (
    <section>
      {content}
    </section>
  )
}

export default PostsList