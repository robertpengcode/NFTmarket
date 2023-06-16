import { ethers } from "ethers";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import moment from "moment";

export default function PriceChart({ transactions, tokenId }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };

  const labels = transactions
    ? transactions.map((tran) => moment.unix(tran.time).format("MM-DD-YYYY"))
    : [];

  const data = {
    labels,
    datasets: [
      {
        label: `Token #${tokenId} Price (MATIC)`,
        data: transactions
          ? transactions.map((tran) => ethers.utils.formatEther(tran.price))
          : [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return data ? <Line options={options} data={data} /> : null;
}
