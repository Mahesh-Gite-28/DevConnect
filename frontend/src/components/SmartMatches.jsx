import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const SmartMatches = () => {
  const [matches, setMatches] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [page]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        BASE_URL + `/user/smart-matches?page=${page}`,
        { withCredentials: true }
      );

      const newData = res.data;

      if (newData.length < 10) {
        setHasMore(false);
      }

      setMatches((prev) =>
        page === 1 ? newData : [...prev, ...newData]
      );

    } catch (err) {
      console.error("Smart match error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      {/* 🔥 Enhanced Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          🔥 Smart <span className="text-emerald-400">Matches</span>
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Discover developers who share similar skills with you.
        </p>
      </div>

      {/* 🔄 Loading First Page */}
      {loading && page === 1 && (
        <div className="flex justify-center items-center mt-20">
          <span className="loading loading-spinner loading-lg text-emerald-400"></span>
        </div>
      )}

      {/* ❌ No Matches State */}
      {!loading && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <h2 className="text-2xl font-semibold text-gray-300">
            No Smart Matches Found
          </h2>
          <p className="text-gray-500 mt-3 max-w-md">
            Try adding more skills to your profile to improve your matching results.
          </p>
        </div>
      )}

      {/* ✅ Matches Grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {matches.map((user) => (
          <UserCard
            key={user._id}
            data={user}
            onAction={() =>
              setMatches((prev) =>
                prev.filter((u) => u._id !== user._id)
              )
            }
          />
        ))}
      </div>

      {/* 🔽 Load More Button */}
      {hasMore && matches.length > 0 && (
        <div className="flex justify-center mt-12">
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

export default SmartMatches;
