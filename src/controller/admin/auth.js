const User = require("../../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { kirimEmail } = require("../../helpers");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already registered",
      });

    User.estimatedDocumentCount(async (err, count) => {
      if (err) return res.status(400).json({ error });
      let role = "admin";
      if (count === 0) {
        role = "super-admin";
      }

      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role,
      });

      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        if (data) {
          return res.status(201).json({
            message: "Admin created Successfully..!",
          });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (
        isPassword &&
        (user.role === "admin" || user.role === "super-admin")
      ) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};

// reset-password sendMail
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  //console.log(user);

  if (!user) {
    return res.status(200).json({
      status: false,
      message: "email tidak di temukan",
    });
  }

  const token = jwt.sign(
    {
      iduser: user._id,
    },
    process.env.JWT_SECRET
  );
  //console.log(user)

  await user.updateOne({ resetPasswordLink: token });

  // template email
  const templateEmail = {
    from: "online Shopp",
    to: email,
    subject: "Link reset password",
    html: `<p>silakan klik link dibawah ini untuk reset password</p><p><a href="${process.env.CLIENT_URL}/resetpassword/${token}">Reset Sekarang</a></p>`,
  };
  kirimEmail(templateEmail);

  return res.status(201).json({
    status: true,
    message: "Link reset password berhasil terkirim",
  });
};

// update password to data respon from email
exports.changePassword = async (req, res) => {
  const { token, password } = req.body
  console.log('token', token)
  console.log('password', password)

  const user = await User.findOne({resetPasswordLink: token})
  //console.log(user)
  if (user) {
    //hash_password field data mongo
    const hash_password = await bcrypt.hash(password, 10)
    user.hash_password = hash_password
    await user.save()
    return res.status(201).json({
      status: true,
      message: "password berhasil di ganti"
    })
  }
}

