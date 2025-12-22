import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import formatPrice from "../../utils/formatPrice";
import NotFound from "../not-found/NotFound";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./AdPage.module.css";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

import callIcon from "../../assets/call.svg";
import AdActionsBar from "../../components/ui/AdActionsBar";

const AdPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await api.get(`ads/${id}`);
        setAd(response.data);
      } catch (err) {
        console.error("Eroare la încărcarea anunțului:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <LoadingSpinner size={60} full />;
  if (!ad) return <NotFound />;

  return (
    <div className={styles.adContainer}>
      <AdActionsBar ad={ad} />

      <div className={styles.adGrid}>
        {/* Left column */}
        <div className={styles.mainContent}>
          <div className={styles.adGalleryWrapper}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="mySwiper"
            >
              {ad.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img.url} alt={`${ad.title} - ${index}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className={styles.adCard}>
            <Link
              to={`/categories/${ad.category.id}`}
              className={styles.categoryBadge}
            >
              {ad.category.name}
            </Link>

            <div className={styles.adLocation}>{ad.city}</div>
            <h1 className={styles.adTitleMain}>{ad.title}</h1>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Postat pe: {new Date(ad.created_at).toLocaleDateString("ro-RO")}
            </p>
          </div>

          <div className={styles.adCard}>
            <h3>Descriere</h3>
            <p className={styles.adDescription}>{ad.description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.sidebar}>
          <div className={`${styles.sidebarSticky} ${styles.adCard}`}>
            <div className={styles.adPrice}>
              {formatPrice(ad.price, ad.currency)}
            </div>

            <Link to={`/profile/${ad.user.id}`} className={styles.sellerBox}>
              <div className={styles.sellerAvatar}>
                {ad.user.first_name[0]}
                {ad.user.last_name[0]}
              </div>
              <div style={{ fontWeight: "600" }}>
                {ad.user.first_name} {ad.user.last_name}
              </div>
            </Link>

            <div className={styles.contactActions}>
              <button
                className={styles.btnPrimary}
                onClick={() => setShowPhone(!showPhone)}
              >
                {showPhone ? (
                  <div className={styles.phoneWrapper}>
                    <img
                      src={callIcon}
                      alt="Call"
                      className={styles.callIcon}
                    />
                    <span>{formatPhoneNumber(ad.user.phone_number)}</span>
                  </div>
                ) : (
                  "Sunați Vânzătorul"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPage;
