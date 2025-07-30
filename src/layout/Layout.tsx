// src/layout/Layout.tsx
import { Outlet, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

type ContextType = {
  user: any;
  setUser: (user: any) => void;
};

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
      <Header user={user} />
      <main>
        <Outlet context={{ user, setUser }} /> {/* 下層ページに user を渡す */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
