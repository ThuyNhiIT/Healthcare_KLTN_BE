const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/User");

const checkPhoneExists = async (userPhone) => {
  let phone = await User.findOne({ phone: userPhone });
  if (phone) {
    return true;
  }
  return false;
};

const checkEmailExists = async (emailUser) => {
  let email = await User.findOne({ email: emailUser });
  if (email) {
    return true;
  }
  return false;
};

// hash password
const salt = bcrypt.genSaltSync(10);
const hashPassWord = (userPassWord) => {
  return bcrypt.hashSync(userPassWord, salt);
};

const checkPassword = (userPassWord, hashPassWord) => {
  return bcrypt.compareSync(userPassWord, hashPassWord); // true or false
};

const handleLogin = async (rawData) => {
  try {
    // Tìm tài khoản bằng email
    let user = await User.findOne({ email: rawData.user.email });

    if (!user) {
      user = new User({
        uid: rawData.user.uid,
        email: rawData.user.email,
        username: rawData.user.displayName,
        password: "",
        avatar: rawData.user.photoURL,
      });
    }
    // nếu có thì update thông tin
    user.uid = rawData.user.uid;

    await user.save();
    // Trả về thành công
    return {
      EM: "Login successfully",
      EC: 0,
      DT: {
        userId: user.id,
        uid: user.uid,
        email: user.email,
        username: user.username,
        address: user.address,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role, // doctor, patient
      },
    };
  } catch (error) {
    console.log(">>>>check Err Login user: ", error);
    return {
      EM: "something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

const handleRegister = async (rawData) => {
  try {
    let isEmailExists = await checkEmailExists(rawData.email);
    if (isEmailExists) {
      return {
        EM: "your email is already exists",
        EC: 1,
        DT: "",
      };
    }

    let isPhoneExists = await checkPhoneExists(rawData.phoneNumber);
    if (isPhoneExists) {
      return {
        EM: "SĐT is already exists",
        EC: 1,
        DT: "",
      };
    }

    let newUser = {
      email: rawData.email,
      username: rawData.username,
      password: hashPassWord(rawData.password),
      phone: rawData.phoneNumber,
      address: rawData.address,
      gender: rawData.gender,
      dob: rawData.dob,
      avatar: rawData.avatar,
      captcha: rawData.captcha,
    };

    // Tạo tài khoản mới trong MongoDB
    let user = new User(newUser);
    await user.save();

    return {
      EM: "register success",
      EC: 0,
      DT: {},
    };
  } catch (error) {
    console.log(">>>>check Err Register user: ", error);
    return {
      EM: "something wrong in service ...",
      EC: -2,
      DT: "",
    };
  }
};

// const updateCode = async (email, code) => {
//   try {
//     await User.updateOne({ email: email }, { $set: { code: code } });

//     return {
//       EM: "ok",
//       EC: 0,
//       DT: "",
//     };
//   } catch (error) {
//     console.log(">>>>check Err update code send email: ", error);
//     return {
//       EM: "something wrong in service ...",
//       EC: -2,
//       DT: "",
//     };
//   }
// };

// const updatePassword = async (email, password, code) => {
//   try {
//     const user = await User.findOne({ email: email, code: code });

//     if (user) {
//       // update password
//       user.password = hashPassWord(password);
//       await user.save();

//       return {
//         EM: "ok",
//         EC: 0,
//         DT: user,
//       };
//     }

//     return {
//       EM: `Code ${code} is incorrect`,
//       EC: 1,
//       DT: "",
//     };
//   } catch (error) {
//     console.log(">>>>check Err check code: ", error);
//     return {
//       EM: "something wrong in service ...",
//       EC: -2,
//       DT: "",
//     };
//   }
// };

// const changePassword = async (phone, currentPassword, newPassword) => {
//   try {
//     const user = await User.findOne({ phone });

//     if (user) {
//       let isCorrectPassword = checkPassword(currentPassword, user.password);
//       if (isCorrectPassword) {
//         // update password
//         user.password = hashPassWord(newPassword);
//         await user.save();

//         return {
//           EM: "ok",
//           EC: 0,
//           DT: user,
//         };
//       }
//       return {
//         EM: `currentPassword ${currentPassword} is incorrect`,
//         EC: 1,
//         DT: "",
//       };
//     }
//   } catch (error) {
//     console.log(">>>>check Err changePassword: ", error);
//     return {
//       EM: "something wrong in service ...",
//       EC: -2,
//       DT: "",
//     };
//   }
// };

module.exports = {
  handleLogin,
  hashPassWord,
  handleRegister,
};
