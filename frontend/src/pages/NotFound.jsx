import { Link } from "react-router-dom";

const NotFoundPage = () => {
  
  return (
    <div className="notFoundContainer">
      <h1>404</h1>
      <h2>Pagina nu a fost găsită</h2>
      <p>Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.</p>
      <Link to="/" className="homeButton">
        Înapoi la pagina principală
      </Link>
    </div>
  );
};

export default NotFoundPage;