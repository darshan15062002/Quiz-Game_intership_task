

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,

} from "react-router-dom";

import AddQuiz from "./pages/AddQuiz/AddQuiz.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";

import { AuthContext } from "./context/AuthContext.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { useContext, useEffect, useState } from "react";
import Quiz from "./pages/Quiz/Quiz.js";


const Layout = () => {
  return (
    <div className="app">

      <Outlet />

    </div>
  )
}


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDoc(doc(db, 'users', currentUser.uid));
        const user = res.data();
        console.log(user, 'darshan');
        if (!user.isAdmin) {
          setLoading(true)
          navigate('/quiz');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return children;
  }
}




const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/addquiz",
        element: <ProtectedRoute><AddQuiz /></ProtectedRoute>,
      },
      {
        path: "/",
        element: <Login />,
      },
    ]
  },


  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  }



]);

function App() {


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;