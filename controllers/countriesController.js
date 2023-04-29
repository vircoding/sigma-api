import fs from "fs/promises";

export const getCountries = async (req, res) => {
  try {
    const data = await fs.readFile("./resources/countries.json", "utf-8");
    const countries = JSON.parse(data);

    return res.json(countries);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
