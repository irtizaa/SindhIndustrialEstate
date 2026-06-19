import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Kharian() {
  return (
    <CityCard
      name="Kharian"
      description="Click to view kharian details"
      colors="bg-gradient-to-r from-yellow-500 to-yellow-700"
      Icon={Building}
      route="/kharian"
    />
  );
}
