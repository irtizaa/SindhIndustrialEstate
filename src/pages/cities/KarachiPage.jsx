import AnalyticsLayout from "../../components/AnalyticsLayout";
import { Users, AlertCircle, DollarSign, TrendingUp } from "lucide-react";
import GlobalLayout from "../../layouts/GlobalLayout";

export default function KarachiPage() {
  const stats = [
    { title: "Total Customers", value: "25,430", icon: <Users className="text-blue-600" size={28} />, color: "from-blue-500 to-blue-700" },
    { title: "Open Complaints", value: "142", icon: <AlertCircle className="text-red-600" size={28} />, color: "from-red-500 to-red-700" },
    { title: "Monthly Revenue", value: "$75,000", icon: <DollarSign className="text-green-600" size={28} />, color: "from-green-500 to-green-700" },
    { title: "Growth", value: "+12%", icon: <TrendingUp className="text-purple-600" size={28} />, color: "from-purple-500 to-purple-700" },
  ];

  const complaintsData = [
    { month: "Jan", complaints: 120 },
    { month: "Feb", complaints: 90 },
    { month: "Mar", complaints: 140 },
    { month: "Apr", complaints: 110 },
    { month: "May", complaints: 180 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 60000 },
    { month: "May", revenue: 75000 },
  ];

  return (
                    
    <AnalyticsLayout city="karachi" stats={stats} complaintsData={complaintsData} revenueData={revenueData} />
    )
}
