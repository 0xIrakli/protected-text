import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Note } from "./Note"

const router = createBrowserRouter(
  createRoutesFromElements(<Route path=":noteTitle" element={<Note />} />)
)

function App() {
  return <RouterProvider router={router} />
}

export default App
