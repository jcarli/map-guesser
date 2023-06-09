import headerStyles from "@/styles/Header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <Link
      href="/"
      style={{
        textDecoration: "none",
        fontSize: 30,
      }}
    >
      <header>
        <h2 className={headerStyles.title}>Närmast vinner</h2>
        <title>Närmast vinner</title>
        <meta name="keywords" content="game" />
      </header>
    </Link>
  );
};

export default Header;
