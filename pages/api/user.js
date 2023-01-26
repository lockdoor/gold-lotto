import { validateInputText } from "@/lib/helper";
import connectDB from "@/database/connectDB";
import User from "@/model/user";
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res
      .status(400)
      .json({ message: `allow post only, ${req.method} not allow` });
    return;
  }
  const { userId, oldPassword, password } = req.body;
  if (validateInputText(password, "password")) {
    res.status(400).json({ hasError: true, message: "password wrong!" });
    return;
  } else {
    try {
      await connectDB();
      const user = await User.findById(userId);
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        res
          .status(400)
          .json({ hasError: true, message: "old password wrong!" });
      } else {
        const passwordHass = await bcrypt.hash(password.trim(), 8);
        await User.updateOne({ _id: userId, password: passwordHass });
        res.status(201).json({ message: "update password success" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
