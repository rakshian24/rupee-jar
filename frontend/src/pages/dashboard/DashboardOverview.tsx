import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_TRANSACTIONS } from "../../graphql/queries";
import { Stack, Typography } from "@mui/material";
import { Transaction } from "../../types";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "../../constants";

type Props = {};

const DashboardOverview = (props: Props) => {
  const { data, loading } = useQuery(GET_ALL_TRANSACTIONS);

  const transactions = data?.getAllTransactions || [];

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <Stack gap={2}>
      <Typography>Dashboard Overview</Typography>
      {transactions.map((transaction: Transaction) => (
        <Stack gap={2}>
          <Typography>{transaction?.description}</Typography>
          <Typography>
            {dayjs(transaction.date).format(ISO_DATE_FORMAT)}
          </Typography>
          <Typography>{transaction?.type}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default DashboardOverview;
