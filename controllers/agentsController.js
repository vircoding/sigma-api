import { Agent } from "../models/Agent.js";
import { Post } from "../models/Post.js";

export const getAgentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) return res.status(403).json({ error: "Agent not founded" });

    return res.json({
      uid: agent.uid,
      firstname: agent.firstname,
      lastname: agent.lastname,
      phone: agent.phone,
      bio: agent.bio,
      public_email: agent.public_email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAgentPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const { id } = req.params;
    const posts = await Post.find({ uid: id })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_posts = await Post.find({ uid: id }).countDocuments();

    return res.json({
      posts,
      page: total_posts === 0 ? 0 : page,
      total_posts,
      total_pages: Math.ceil(total_posts / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
