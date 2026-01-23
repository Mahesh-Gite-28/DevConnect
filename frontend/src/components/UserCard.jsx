const UserCard = ({ data }) => {
  const { firstName, lastName, photoUrl, about, skills, gender, age } = data;

  return (
    <div className="flex justify-center my-40">
      <div className="card bg-base-300 w-96 shadow-sm ">
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {(age||gender)&&<div>
            <h3>Basic Info</h3>
            <p>{age}</p>
            <p>{gender}</p>
          </div>}
          <div>
            <h3>About</h3>
            <p>{about}</p>
          </div>
          <div>
            <h3>Skills</h3>
            
          </div>
          <div className="card-actions justify-center my-4">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
