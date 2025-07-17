import '../styles/index.css';
import "../styles/App.css";
type Props = {
  children: React.ReactNode;
};

function Header(props: Props) {
  const { children } = props;

  return (
    <div>
      <header className="app-header">
      <h1 className="app-title">MOVIEBOX</h1>
      <p className="text-3xl text-yellow-400 bg-blue-500 p-4">Tailwind Test</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
export default Header;