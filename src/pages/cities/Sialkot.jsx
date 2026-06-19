import { Building } from "lucide-react";
import CityCard from "./CityCard";

export default function Sialkot() {
  return (
    <CityCard
      name="Sialkot"
      description="Click to view Sialkot details"
      colors="bg-gradient-to-r from-blue-500 to-blue-700"
      Icon={Building}
      route="/sialkot"
    />
  );
}
