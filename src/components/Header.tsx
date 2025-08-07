import '../styles/index.css';
import "../styles/App.css";
import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { BiLogOut } from "react-icons/bi";
import { toast } from "react-toastify"; 

type Props = {
  children?: React.ReactNode;
  user: any;
  setUser: (user: any) => void; 
};

function Header({ children, user, setUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      const params = new URLSearchParams(location.search);
      const scrollTarget = params.get('scrollTo');
      
      if (scrollTarget) {
        const timer = setTimeout(() => {
          const element = document.getElementById(scrollTarget);
          if (element) {
            element.scrollIntoView({ 
              behavior: "smooth",
              block: "start"
            });
            window.history.replaceState({}, '', '/');
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.search]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ログアウト処理関数を追加
const handleLogout = async () => {
  try {
    toast.success("ログアウトしました");
    await signOut(auth);
     if (typeof setUser === 'function') { 
        setUser(null);
      }
    setIsOpen(false);
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);

    if (sectionId === "mylist" && !user) {
      navigate("/login");
      return;
    }

    if (sectionId === "login" && user) {
      handleLogout(); 
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/?scrollTo=${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState({}, '', '/');
    }
  };

  const navItems = [
    { label: "MOVIE", href: "movie" },
    { label: "ANIME", href: "anime" },
    { label: "MY LIST", href: "mylist" },
    { 
      label: user ? (
        <span className="flex items-center">
          <BiLogOut className="mr-1" /> LOGOUT
        </span>
      ) : "LOGIN", 
      href: "login" 
    },
  ];

  return (
    <div>
      <header className="bg-[#181818]/80 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="app-title text-white text-lg font-bold hover:opacity-80 transition"
        >
          MOVIEBOX
        </Link>

        <nav className="hidden md:flex gap-8 text-white text-sm font-semibold">
          {navItems.map(({ label, href }) => (
            <a
              key={typeof label === 'string' ? label : 'logout'}
              href={`#${href}`}
              onClick={(e) => handleNavClick(href, e)}
              className="min-w-[80px] text-center hover:text-yellow-400 transition flex items-center justify-center"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden text-white z-50"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="space-y-1">
              <div className="w-7 h-0.5 bg-white"></div>
              <div className="w-7 h-0.5 bg-white"></div>
              <div className="w-7 h-0.5 bg-white"></div>
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-14 right-0 w-1/2 z-40 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          transition-opacity
          ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-start justify-start">
          {navItems.map(({ label, href }, index) => (
            <a
              key={typeof label === 'string' ? label : 'logout'}
              href={`#${href}`}
              onClick={(e) => handleNavClick(href, e)}
              className={`w-full text-lg font-semibold px-6 py-4 border-b border-gray-700 hover:text-yellow-400 transition flex items-center
                ${index === navItems.length - 1 ? 'border-b-0' : ''}
              `}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <main className="mt-14">{children}</main>
    </div>
  );
}

export default Header;