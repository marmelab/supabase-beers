import { supabase } from "../../utils/initSupabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data: beers, error } = await supabase
      .from("beers")
      .insert([req.body]);

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(beers);
  }

  const { data: beers, error } = await supabase
    .from("beers")
    .select("*")
    .order("name", true);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(beers);
}
