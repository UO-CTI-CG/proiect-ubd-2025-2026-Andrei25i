import { useState, useEffect } from "react";
import locationsData from "../../data/romanian_locations.json";
import styles from "./LocationSelector.module.css";

const LocationSelector = ({
  selectedCounty,
  selectedCity,
  onCountyChange,
  onCityChange,
  register=true
}) => {
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (selectedCounty) {
      const cities = locationsData[selectedCounty];
      setAvailableCities(cities || []);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCounty]);

  const handleCountySelect = (e) => {
    const newCounty = e.target.value;
    onCountyChange(newCounty);
    onCityChange("");
  };

  const countiesList = Object.keys(locationsData).sort();

  return (
    <div className={styles.container}>
      <div className={styles.selectGroup}>
        <label htmlFor="judet">Județ {register ? "*" : ""}</label>
        <select
          id="judet"
          value={selectedCounty}
          onChange={handleCountySelect}
          className={`${styles.select} ${
            selectedCounty ? styles.hasValue : ""
          }`}
          required
        >
          <option value="">Alegeți Județul</option>
          {countiesList.map((judetNume) => (
            <option key={judetNume} value={judetNume}>
              {judetNume}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label htmlFor="localitate">Localitate {register ? "*" : ""}</label>
        <select
          id="localitate"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={`${styles.select} ${selectedCity ? styles.hasValue : ""}`}
          disabled={!selectedCounty}
          required
        >
          <option value="">
            {selectedCounty ? "Alegeți localitatea" : "Selectați întâi județul"}
          </option>
          {availableCities.map((city, index) => (
            <option key={`${selectedCounty}${index}`} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
