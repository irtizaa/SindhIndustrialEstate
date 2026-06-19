import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Rawalpindi() {
  return (
    <CityCard
      name="Rawalpindi"
      description="Click to view Rawalpindi details"
      colors="bg-gradient-to-r from-purple-500 to-purple-700"
      Icon={Building}
      route="/rawalpindi"
    />
  );
}
