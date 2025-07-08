import { useMediaQuery } from "@mui/material";
import { screenSize } from "../../constants";
import AddTransactionMobile from "./AddTransactionMobile";
import AddTransactionDesktop from "./AddTransactionDesktop";

type Props = {};

const AddTransaction = (props: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  if (isTablet) {
    return <AddTransactionMobile />;
  }
  return <AddTransactionDesktop />;
};

export default AddTransaction;
