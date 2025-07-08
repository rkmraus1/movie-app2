import "./App.css";
type Props = {
  children: React.ReactNode;
};

function Header(props: Props) {
  const { children } = props;

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">MOVIEBOX</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Header;