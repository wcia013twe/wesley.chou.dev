import "./App.css";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import { HelmetProvider } from "react-helmet-async";
import Particles from "./components/Particles";
import PageLoader from "./components/PageLoader";

// Lazy-load each page so their JS (including Three.js) is only downloaded
// when the user navigates to that route, not on the initial page load.
const HomePage       = lazy(() => import("./pages/HomePage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const ProjectsPage   = lazy(() => import("./pages/ProjectsPage"));
const SkillsPage     = lazy(() => import("./pages/SkillsPage"));

const Layout = () => (
  <>
    <Navbar />
    {/* Black background layer */}
    <div className="fixed inset-0 -z-30 bg-black" />
    {/* Particles layer */}
    <div className="fixed inset-0 -z-20">
      <Particles
        particleColors={["#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={50}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
    </div>
    <main>
      {/* Suspense boundary for lazy-loaded page chunks */}
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
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
