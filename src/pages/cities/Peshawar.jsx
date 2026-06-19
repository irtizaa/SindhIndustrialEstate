import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Peshawar() {
  return (
    <CityCard
      name="Peshawar"
      description="Click to view Peshawar details"
      colors="bg-gradient-to-r from-orange-500 to-orange-700"
      Icon={Building}
      route="/peshawar"
    />
  );
}
