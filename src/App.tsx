import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import PostsPage from "./pages/PostsPage";
import SkillsPage from "./pages/SkillsPage";
import Navbar from "./components/NavBar";
import { HelmetProvider } from "react-helmet-async";

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "skills", element: <SkillsPage /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
