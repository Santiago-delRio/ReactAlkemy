import { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Spinner = lazy(() => import("./components/Spinner"));
const Error404 = lazy(() => import("./components/Error404"));
const Login = lazy(() => import("./pages/Login"));
const Registro = lazy(() => import("./pages/Registro"));
const Tareas = lazy(() => import("./pages/Tareas"));

function App() {
  const location = useLocation();

  // Si no esta loggeado que no entre a tareas
  const RequireAuth = ({ children }) => {
    if (!localStorage.getItem("token")) {
      return <Navigate to="/" replace={true} />;
    }
    return children;
  };

  // Si esta loggeado que no entre a login ni registro
  const Logged = ({ children }) => {
    if (localStorage.getItem("token")) {
      return <Navigate to="/tareas" replace={true} />;
    }
    return children;
  };

  const pageTransition = {
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route
          path="*"
          element={
            <motion.div
              className="page"
              initial="out"
              animate="in"
              exit="out"
              variants={pageTransition}
            >
              <Suspense fallback={
                <Spinner/>
              }>
                <Error404 />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/"
          element={
            <Logged>
              <motion.div
                className="page"
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
              >
                <Suspense fallback={
                  <Spinner/>
                }>
                  <Login />
                </Suspense>
              </motion.div>
            </Logged>
          }
        />
        <Route
          path="/registro"
          element={
            <Logged>
              <motion.div
                className="page"
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
              >
                <Suspense fallback={
                  <Spinner/>
                }>
                  <Registro />
                </Suspense>
                
              </motion.div>
            </Logged>
          }
        />
        <Route
          path="/tareas"
          element={
            <RequireAuth>
              <motion.div
                className="page"
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
              >
                <Suspense fallback={
                  <Spinner/>
                }>
                  <Tareas />
                </Suspense>
              </motion.div>
            </RequireAuth>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
