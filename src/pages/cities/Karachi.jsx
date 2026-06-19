import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Karachi() {
  return (
    <CityCard
      name="Karachi"
      description="Click to view Karachi details"
      colors="bg-gradient-to-r from-blue-500 to-blue-700"
      Icon={Building}
      route="/karachiStats"
    />
  );
}
