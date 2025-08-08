const authService = require("../services/authService");
const emailService = require("../services/emailService");

const handleLogin = async (req, res) => {
  try {
    let data = await authService.handleLogin(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("check control login", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: 2, //error code
      DT: "", // data
    });
  }
};
const handleRegister = async (req, res) => {
  try {
    console.log("check control register", req.body.formData);

    if (!req.body.formData.avatar) {
      req.body.formData.avatar = "https://i.imgur.com/cIRFqAL.png";
    }
    let data = await authService.handleRegister(req.body.formData);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("check control register", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: 2, //error code
      DT: "", // data
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let email = req.body.email;
    let code = req.body.code;
    let password = req.body.password;

    let user = await authService.updatePassword(email, password, code);
    if (user.EC !== 0) {
      return res.status(401).json({
        EM: user.EM,
        EC: user.EC,
        DT: "",
      });
    }

    return res.status(200).json({
      EM: "ok",
      EC: 0,
      DT: "",
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    let phone = req.body.phone;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    let user = await authService.changePassword(
      phone,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      EM: user.EM,
      EC: user.EC,
      DT: "",
    });
  } catch (error) {
    console.error("Error changePassword: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    let email = req.body.email;

    let code = await emailService.sendSimpleEmail(email); // gửi mail -> lấy code, time

    return res.status(200).json({
      EM: "ok",
      EC: 0,
      DT: code,
    });
  } catch (error) {
    console.error("Error verifyEmail: ", error);
    return res.status(500).json({
      EM: "error verifyEmail from server",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  resetPassword,
  changePassword,
  verifyEmail,
};
