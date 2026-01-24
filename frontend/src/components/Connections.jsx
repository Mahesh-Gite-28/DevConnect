import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addconnections } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const userconnection = useSelector((store) => store.connections);

  const myconnections = async () => {
    try {
      const getconnections = await axios.get(
        BASE_URL + "/user/connections",
        { withCredentials: true }
      );

      dispatch(addconnections(getconnections?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    myconnections();
  }, []);

  if (!userconnection) return null;

  if (userconnection.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No connections yet
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-6">Connections</h2>

      {/* Cards */}
      <div className="space-y-4">
        {userconnection.map((connection) => (
          <div
            key={connection._id}
            className="bg-white rounded-xl shadow-md p-4 flex gap-4 text-gray-900"
          >
            {/* Profile Image */}
            <img
              src={connection.photoUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {connection.firstName} {connection.lastName}
              </h3>

              <p className="text-sm text-gray-500">
                {connection.age} yrs • {connection.gender}
              </p>

              {/* Skills */}
              {connection.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {connection.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* About */}
              {connection.about && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {connection.about}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
