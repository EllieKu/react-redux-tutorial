import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import AddPostForm from "./features/posts/AddPostForm";
import PostsList from "./features/posts/PostsList";
import SinglePost from "./features/posts/SinglePost";
import EditPostForm from "./features/posts/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
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

    <Route path="user">
      <Route index element={<UsersList />} />
      <Route path=":userId" element={<UserPage />} />
    </Route>

    {/* replace with 404 component */}
    <Route path="*" element={<Navigate to="/" replace />}></Route>
  </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
