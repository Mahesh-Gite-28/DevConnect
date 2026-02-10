import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔥 Reset when query changes
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query) return;

      try {
        setLoading(true);

        const res = await axios.get(
          BASE_URL + `/user/search?query=${query}&page=${page}`,
          { withCredentials: true }
        );

        const newUsers = res.data;

        // If less than limit (9), no more pages
        if (newUsers.length < 9) {
          setHasMore(false);
        }

        setResults((prev) =>
          page === 1 ? newUsers : [...prev, ...newUsers]
        );

      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query, page]);

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h2>

      {loading && page === 1 && <p>Loading...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-400">No users found.</p>
      )}

      <div className="flex flex-wrap gap-6 justify-center">
        {results.map((user) => (
          <UserCard
            key={user._id}
            data={user}
            onAction={() =>
              setResults((prev) =>
                prev.filter((u) => u._id !== user._id)
              )
            }
          />
        ))}
      </div>

      {/* 🔥 Load More Button */}
      {hasMore && results.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="btn btn-outline btn-success"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
