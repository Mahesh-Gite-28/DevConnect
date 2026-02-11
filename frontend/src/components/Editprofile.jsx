import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  // 🔥 Local editable states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // 🔥 Sync Redux user → Local state (single source of truth = Redux)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || "");
      setAbout(user.about || "");
      setGender(user.gender || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  // 🔥 Prevent memory leak from preview URL
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
    };
  }, [selectedFile]);

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.includes(value)) return;
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const removeSkill = (indexToRemove) => {
    setSkills((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // 🔥 Save Profile Handler
  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);
      formData.append("skills", JSON.stringify(skills));

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        formData,
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      toast.success(res?.data?.message || "Profile updated");

      setSelectedFile(null);

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  // 🔥 Live Preview
  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : user?.photoUrl;

  return (
    <div className="min-h-[calc(100vh-80px)] px-10 pt-18">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT FORM */}
        <form
          onSubmit={handleProfileSave}
          className="card bg-base-200 shadow-lg p-6 w-full md:w-1/2 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-success">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-sm text-gray-400">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label text-sm text-gray-400">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-sm text-gray-400">
                Age
              </label>
              <input
                type="number"
                min={12}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label text-sm text-gray-400">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-sm text-gray-400">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="label text-sm text-gray-400">
              About
            </label>
            <textarea
              rows="3"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="textarea textarea-bordered w-full resize-none"
            />
          </div>

          <div>
            <label className="label text-sm text-gray-400">
              Skills
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-success"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-outline flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-error font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-success">
              Save Profile
            </button>
          </div>
        </form>

        {/* RIGHT SIDE PREVIEW */}
        <div className="ml-35">
          <UserCard
            data={{
              firstName,
              lastName,
              age,
              about,
              photoUrl: previewUrl,
              gender,
              skills,
              membershipType: user?.membershipType,
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default EditProfile;
