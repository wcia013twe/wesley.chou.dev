import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import PostsPage from "./pages/PostsPage";
import SkillsPage from "./pages/SkillsPage";
import Navbar from "./components/NavBar";
import { HelmetProvider } from "react-helmet-async";
import ExperiencePage from "./pages/ExperiencePage";
import PixelBlast from "./components/PixelBlast";

const Layout = () => (
  <>
    <Navbar />
    <div className="fixed inset-0 -z-20 bg-black/80 opacity-85">
      <PixelBlast variant="square" className="bg-[#000014]"  color="#a78bfa" patternDensity={0.9}/>
    </div>
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
      { path: "experience", element: <ExperiencePage /> },
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
