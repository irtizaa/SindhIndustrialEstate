import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Lahore() {
  return (
    <CityCard
      name="Lahore"
      description="Click to view Lahore details"
      colors="bg-gradient-to-r from-green-500 to-green-700"
      Icon={Building}
      route="/lahore"
    />
  );
}
