import { supabase } from "@/lib/supabase";

export default async function TestDatabase() {
  const { data, error } = await supabase
    .from("buttons")
    .select("*");

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-3xl font-bold">
        Database Test
      </h1>

      <pre className="mt-8 rounded-xl bg-slate-900 p-6">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}