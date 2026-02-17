import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🚀 ટિકિટ બનાવવાનું ફંક્શન (આનાથી યુઝર વારંવાર લોગીન નહિ કરવું પડે)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= SIGNUP (નવું એકાઉન્ટ) =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;

    // ૧. 🛡️ સિક્યોરિટી ચેક: શું આ ઈમેલથી પહેલેથી એકાઉન્ટ છે? (Duplicate Check)
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email! Please Login.",
        });
    }

    // ૨. વેલિડેશન: ઈમેલ સાચું છે અને પાસવર્ડ મજબૂત છે?
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
    }

    // ૩. 🔒 પાસવર્ડને છુપાવો (Hashing) - હવે કોઈને અસલી પાસવર્ડ નહિ દેખાય!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ૪. નવો ડેટા ડેટાબેઝમાં સેવ કરો
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword, // અસલી નહિ, છુપાયેલો પાસવર્ડ જશે
      dob,
      gender,
    });

    const user = await newUser.save();

    // ૫. એકાઉન્ટ બની ગયું, હવે એને ૭ દિવસ માટે લોગીન ટિકિટ આપી દો
    const token = createToken(user._id);
    res
      .status(201)
      .json({ success: true, token, message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN (જૂનું એકાઉન્ટ ખોલવા) =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ૧. ચેક કરો કે આ ઈમેલ વાળો યુઝર ડેટાબેઝમાં છે?
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User doesn't exist! Please Sign up.",
        });
    }

    // ૨. 🛡️ હાઈ-સિક્યોરિટી પાસવર્ડ મેચિંગ (અસલી પાસવર્ડ અને છુપાયેલો પાસવર્ડ સરખાવો)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // પાસવર્ડ સાચો છે! નવી ટિકિટ આપી દો.
      const token = createToken(user._id);
      res.json({ success: true, token, message: "Login Successful!" });
    } else {
      // પાસવર્ડ ખોટો છે!
      res
        .status(400)
        .json({
          success: false,
          message: "Invalid credentials (Wrong Password)",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser };
