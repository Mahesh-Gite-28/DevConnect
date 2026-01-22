import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addfeed } from "../utils/feedSlice";
import { useSelector } from "react-redux";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getfeed = async () => {
    try {

      const userfeed = await axios.get(
        BASE_URL + "/feed",
        { withCredentials: true },
      );

      dispatch(addfeed(userfeed.data));

    } catch (err) {

      console.log(err);//show pop up please login
    }
  };

  useEffect(() => {
    if(!feed)
    {
      getfeed();
    }  
  }, []);

  return <div>Feed</div>;
};

export default Feed;
