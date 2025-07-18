import '../styles/index.css';
import "../styles/App.css";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
};

function Header(props: Props) {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: "MOVIE", href: "#movie" },
    { label: "ANIME", href: "#anime" },
    { label: "MY LIST", href: "#mylist" },
    { label: "LOGIN", href: "#login" },
  ];

  return (
    <div>
      <header className="bg-[#181818]/80 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14">
        <h1 className="app-title">MOVIEBOX</h1>

        <nav className="hidden md:flex gap-8 text-white text-sm font-semibold">
          {navItems.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hover:text-yellow-400 transition"
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
        key={label}
        href={href}
        onClick={() => setIsOpen(false)}
        className={`w-full text-lg font-semibold px-6 py-4 border-b border-gray-700 hover:text-yellow-400 transition
          ${index === navItems.length - 1 ? 'border-b-0' : ''}
        `}
      >
        {label}
      </a>
    ))}
  </div>
</div>


      <main className="pt-14">{children}</main>
    </div>
  );
}

export default Header;
