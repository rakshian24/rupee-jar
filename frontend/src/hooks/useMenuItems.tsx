import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import { ROUTES } from "../constants";

const useMenuItemsList = () => {
  return [
    { text: "Dashboard", icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    {
      text: "Add Transaction",
      icon: <AddIcon />,
      path: ROUTES.ADD_TRANSACTION,
    },
    {
      text: "Transaction History",
      icon: <HistoryIcon />,
      path: ROUTES.TRANSACTION_HISTORY,
    },
    { text: "Categories", icon: <CategoryIcon />, path: ROUTES.CATEGORIES },
    {
      text: "Reports & Analytics",
      icon: <BarChartIcon />,
      path: ROUTES.REPORTS,
    },
    { text: "Settings", icon: <SettingsIcon />, path: ROUTES.SETTINGS },
  ];
};

export default useMenuItemsList;
