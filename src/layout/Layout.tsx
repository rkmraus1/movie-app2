import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Layout = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <main>
        <Outlet context={{ user, setUser }} /> {/* 下層ページに user を渡す */}
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover
        closeOnClick
        theme="dark"
        toastStyle={{
          background: "#333",
          color: "#fff",
          fontSize: "14px",
        }}
      />
    </>
  );
};

export default Layout;
