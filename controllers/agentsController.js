import { Agent } from "../models/Agent.js";

export const getAgentInfo = async (req, res) => {
  try {
    const user = await Agent.findOne({ uid: req.uid });
    if (!user) return res.status(403).json({ error: "Agent not founded" });

    return res.json({
      uid: user.uid,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      bio: user.bio,
      public_email: user.public_email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
