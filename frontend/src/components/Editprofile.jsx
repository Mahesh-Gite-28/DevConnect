import { useState } from "react";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const {
    firstName: fName,
    lastName: lName,
    age: userAge,
    about: userAbout,
    photoUrl: userPhoto,
    skills: userSkills,
    gender: userGender,
  } = user;

  const [firstName, setFirstName] = useState(fName || "");
  const [lastName, setLastName] = useState(lName || "");
  const [age, setAge] = useState(userAge || "");
  const [about, setAbout] = useState(userAbout || "");
  const [photoUrl, setPhotoUrl] = useState(userPhoto || "");
  const [gender, setGender] = useState(userGender || "");
  const [skills, setSkills] = useState(userSkills || []);
  const [skillInput, setSkillInput] = useState("");

  const dispatch = useDispatch();

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

  const handleProfileSave = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.patch(
      `${BASE_URL}/profile/edit`,
      { firstName, lastName, age, photoUrl, about, gender, skills },
      { withCredentials: true }
    );

    console.log("API Response:", res.data);//printing data 

    dispatch(addUser(res?.data?.data));

    toast.success(res?.data?.message || "Profile updated");
  } catch (err) {
    toast.error(
      err?.response?.data?.errors ||
        err?.data?.message ||
        "Something went wrong",
    );
  }
};


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
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
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
                onChange={(e) =>
                  setLastName(e.target.value)
                }
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
                onChange={(e) =>
                  setAge(e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label text-sm text-gray-400">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  Select gender
                </option>
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-sm text-gray-400">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) =>
                setPhotoUrl(e.target.value)
              }
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label text-sm text-gray-400">
              About
            </label>
            <textarea
              rows="3"
              value={about}
              onChange={(e) =>
                setAbout(e.target.value)
              }
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
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
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
                  key={skill}
                  className="badge badge-outline flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(index)
                    }
                    className="text-error font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="btn btn-success"
            >
              Save Profile
            </button>
          </div>
        </form>

        <div className="ml-35">
          <UserCard
            data={{
              firstName,
              lastName,
              age,
              about,
              photoUrl,
              gender,
              skills,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
