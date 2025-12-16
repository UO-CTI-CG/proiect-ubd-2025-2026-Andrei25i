import { useMemo } from "react";
import useAds from "../../hooks/useAds";
import useAuthStore from "../../store/authStore";
import PaginatedList from "../ui/PaginatedList";
import AdCard from "../ui/AdCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import TitleHeader from "../layout/TitleHeader";
import { useParams } from "react-router-dom";

const UserAdsList = () => {
  const authUser = useAuthStore((state) => state.user);
  const { id } = useParams();

  const targetedUserId = id || authUser?.id;
  const isOwnProfile = !id || (authUser && id === authUser.id.toString());

  const filters = useMemo(() => {
    if (!targetedUserId) return null;

    return {
      userId: targetedUserId,
      sort: "date_desc",
    };
  }, [targetedUserId]);

  const { ads, loading, error } = useAds(filters);

  if (!targetedUserId) return null;

  return (
    <>
      <TitleHeader
        title={isOwnProfile ? "Anunțurile mele" : "Anunțurile utilizatorului"}
      />

      {loading ? (
        <div style={{ minHeight: "800px", marginTop: "50px" }}>
          <LoadingSpinner size={60} />
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#666",
            minHeight: "800px",
          }}
        >
          {error}
        </div>
      ) : (
        <PaginatedList
          items={ads}
          renderItem={(item) => <AdCard key={item.id} ad={item} />}
        />
      )}
    </>
  );
};

export default UserAdsList;
