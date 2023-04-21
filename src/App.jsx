import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import AddPostForm from "./features/posts/AddPostForm";
import PostsList from "./features/posts/PostsList";
import SinglePost from "./features/posts/SinglePost";
import EditPostForm from "./features/posts/EditPostForm";
import Layout from "./components/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>

    <Route index element={<PostsList />} />

    <Route path="post">
      <Route index element={<AddPostForm />} />
      <Route path=":postId" element={<SinglePost />} />
      <Route path="edit/:postId" element={<EditPostForm />} />
    </Route>

  </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
