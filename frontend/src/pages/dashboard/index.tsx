import { Backdrop, CircularProgress, Stack } from "@mui/material";
import DashboardOverview from "./DashboardOverview";
import NoAccount from "./NoAccount";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../../graphql/queries";

const Dashboard = () => {
  const { data, loading } = useQuery(GET_ME);

  const hasAccount = !!data?.me?.accounts?.length;

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return <Stack>{hasAccount ? <DashboardOverview /> : <NoAccount />}</Stack>;
};

export default Dashboard;
