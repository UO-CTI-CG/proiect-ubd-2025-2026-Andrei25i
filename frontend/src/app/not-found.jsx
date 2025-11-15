import Link from "next/link";

const notFoundPage = () => {
  
  return (
    <div className="notFoundContainer">
      <h1>404</h1>
      <h2>Pagina nu a fost găsită</h2>
      <p>Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.</p>
      <Link href="/" className="homeButton">
        Înapoi la pagina principală
      </Link>
    </div>
  );
};

export default notFoundPage;
