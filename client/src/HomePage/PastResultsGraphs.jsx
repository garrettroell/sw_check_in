import BarGraph from "./BarGraph";

const PastResultsGraph = ({ checkInResults }) => {
  return (
    <>
      <BarGraph checkInResults={checkInResults} />
    </>
  );
};

export default PastResultsGraph;
