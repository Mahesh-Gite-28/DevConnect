const validator=require("validator");

const validateSignUpData=(req)=>{

    const {firstName, lastName,emailID,password}=req.body;

    if(!firstName || !lastName)
        {
            throw new Error("Name is not valid");
        } 
    
    else if (firstName.length<4 && firstName.length>50)
    {
        throw new Error("FirstName should be 4-50 characters")
    }

    else if (!validator.isEmail(emailID))
    {
        throw new Error("email is not valid");
    }

    else if (!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");
    }
}

const validateProfileEdits = (reqBody) => {
  const allowedEdits = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skills",
  "about",
];

  return Object.keys(reqBody).every((key) =>
    allowedEdits.includes(key)
  );
};


const validatePassword = (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number & symbol"
    );
  }

  return true;
};

module.exports = {
  validateSignUpData,
  validateProfileEdits,
  validatePassword
};
