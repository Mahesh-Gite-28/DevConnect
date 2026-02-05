import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addconnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const userconnection = useSelector((store) => store.connections);

  const [loading, setLoading] = useState(true);

  const myconnections = async () => {
    try {
      const getconnections = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addconnections(getconnections?.data?.data || []));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    myconnections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Connections</h2>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {userconnection.length === 0 && (
          <p className="text-center text-gray-500">No connections yet</p>
        )}

        {userconnection.map((connection) => (
          <div
            key={connection._id}
            className="card bg-base-100 shadow-md p-4 flex flex-row items-center gap-4"
          >
            <img
              src={connection.photoUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {connection.firstName} {connection.lastName}
              </h3>

              <p className="text-sm text-gray-500">
                {connection.age} yrs • {connection.gender}
              </p>

              {connection.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {connection.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-outline badge-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {connection.about && (
                <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                  {connection.about}
                </p>
              )}
            </div>

            <Link to={`/chat/${connection._id}`}>
              <button className="btn btn-sm btn-secondary">Chat</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
