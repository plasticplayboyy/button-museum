import MuseumHall from "@/components/museum/MuseumHall";
import { loadExhibits } from "@/lib/buttons/catalog";

export default async function Home() {
  const { exhibits, dbError } = await loadExhibits();

  return <MuseumHall exhibits={exhibits} dbError={dbError} />;
}
