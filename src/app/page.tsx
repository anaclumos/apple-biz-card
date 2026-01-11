import { getDefaultPlaceForToday } from "@/lib/places.server";
import { HomeContent } from "./home-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const defaultPlace = await getDefaultPlaceForToday();

  return <HomeContent defaultPlace={defaultPlace} />;
}
