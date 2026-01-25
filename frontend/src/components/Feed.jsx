import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);

  const getfeed = async () => {
    try {
      setLoading(true);

      const userfeed = await axios.get(
        BASE_URL + "/feed",
        { withCredentials: true }
      );

      console.log(userfeed);

      dispatch(addfeed(userfeed?.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getfeed();   
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        No users in feed
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-6">
      <UserCard data={feed[0]} />
    </div>
  );
};

export default Feed;
