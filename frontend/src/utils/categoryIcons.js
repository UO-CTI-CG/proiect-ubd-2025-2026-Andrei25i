import electronicsIcon from "../assets/electronics.svg";
import carIcon from "../assets/car.svg";
import houseIcon from "../assets/house.svg";
import sportIcon from "../assets/sport.svg";
import tshirtIcon from "../assets/tshirt.svg";
import booksIcon from "../assets/books.svg";
import moreIcon from "../assets/more.svg";
import homeIcon from "../assets/home.svg";
import autoPartIcon from "../assets/autoPart.svg";
import toysIcon from "../assets/toys.svg";
import serviceIcon from "../assets/service.svg";
import diversityIcon from "../assets/diversity.svg";

export const categoryIconsMap = {
  1: electronicsIcon,
  2: carIcon,
  3: houseIcon,
  4: sportIcon,
  5: tshirtIcon,
  6: booksIcon,
  7: homeIcon,
  8: autoPartIcon,
  9: toysIcon,
  10: serviceIcon,
  11: diversityIcon,
};

export const getCategoryIcon = (id) => {
  return categoryIconsMap[id] || moreIcon;
};
