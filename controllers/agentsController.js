import { Agent } from "../models/Agent.js";
import { formatAgentRes } from "../utils/formatResponses.js";

export const getAgents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const agents = await Agent.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total_agents = await Agent.find().countDocuments();

    return res.json({
      agents: agents.map((item) => {
        return formatAgentRes(item);
      }),
      page: total_agents === 0 ? 0 : page,
      total_agents,
      total_pages: Math.ceil(total_agents / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) return res.status(403).json({ error: "Agent not founded" });

    return res.json(formatAgentRes(agent));
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Agent ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
