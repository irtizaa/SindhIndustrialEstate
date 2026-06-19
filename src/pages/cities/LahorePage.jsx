import AnalyticsLayout from "../../components/AnalyticsLayout";
import { Users, AlertCircle, DollarSign, TrendingUp } from "lucide-react";

export default function LahorePage() {
  const stats = [
    { title: "Total Customers", value: "18,200", icon: <Users className="text-blue-600" size={28} />, color: "from-blue-500 to-blue-700" },
    { title: "Open Complaints", value: "89", icon: <AlertCircle className="text-red-600" size={28} />, color: "from-red-500 to-red-700" },
    { title: "Monthly Revenue", value: "$62,000", icon: <DollarSign className="text-green-600" size={28} />, color: "from-green-500 to-green-700" },
    { title: "Growth", value: "+9%", icon: <TrendingUp className="text-purple-600" size={28} />, color: "from-purple-500 to-purple-700" },
  ];

  const complaintsData = [
    { month: "Jan", complaints: 70 },
    { month: "Feb", complaints: 65 },
    { month: "Mar", complaints: 95 },
    { month: "Apr", complaints: 80 },
    { month: "May", complaints: 120 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 38000 },
    { month: "Feb", revenue: 42000 },
    { month: "Mar", revenue: 46000 },
    { month: "Apr", revenue: 50000 },
    { month: "May", revenue: 62000 },
  ];

  return <AnalyticsLayout city="Lahore" stats={stats} complaintsData={complaintsData} revenueData={revenueData} />;
}
