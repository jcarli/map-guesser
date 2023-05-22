import headerStyles from "@/styles/Header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <Link
      href="/"
      className="gradient-text"
      style={{
        textDecoration: "none",
        fontSize: 30,
      }}
    >
      <header>
        <h1 className={headerStyles.title}>Närmast vinner</h1>
        <title>Närmast vinner</title>
        <meta name="keywords" content="game" />
      </header>
    </Link>
  );
};

export default Header;
