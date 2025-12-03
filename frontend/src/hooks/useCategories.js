import { useEffect, useState } from "react";
import api from "../services/api";

const useCategories = ({ count = null, sort = "id_asc" }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await api.get(`categories?sort=${sort}`);
      setAllCategories(response.data);
    } catch (err) {
      if (!err.response) {
        setError("Eroare la conexiunea cu serverul.");
      } else if (err.response.status >= 500) {
        setError(
          "Serviciul întâmpină probleme momentan. Încercați din nou mai târziu."
        );
      } else {
        setError("Nu s-au putut încărca categoriile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  let displayedCategories = allCategories;

  if (count && count > 0 && allCategories.length > 0) {
    displayedCategories = allCategories.slice(0, count);
  }

  return { categories: displayedCategories, loading, error };
};

export default useCategories;
