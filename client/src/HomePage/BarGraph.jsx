import {
  Box,
  Heading,
  HStack,
  useColorMode,
  useDimensions,
} from "@chakra-ui/react";
import { useRef } from "react";

const BarGraph = ({ checkInResults }) => {
  const { colorMode } = useColorMode();
  const chartRef = useRef();
  const dimensions = useDimensions(chartRef, true);

  let width;
  if (dimensions) {
    width = dimensions.borderBox.width;
  }

  let histogramData = {
    A_1_to_30: 0,
    A_31_to_60: 0,
    B_1_to_30: 0,
    B_31_to_60: 0,
    C_1_to_30: 0,
    C_31_to_60: 0,
  };

  // fill the histogram data object
  checkInResults.forEach((result) => {
    const posNum = result.positionNumber;

    if (posNum <= 30) {
      histogramData.A_1_to_30 = 1;
    } else if (posNum > 30 && posNum <= 60) {
      histogramData.A_31_to_60 += 1;
    } else if (posNum > 60 && posNum <= 90) {
      histogramData.B_1_to_30 += 1;
    } else if (posNum > 90 && posNum <= 120) {
      histogramData.B_31_to_60 += 1;
    } else if (posNum > 120 && posNum <= 150) {
      histogramData.C_1_to_30 += 1;
    } else if (posNum > 150 && posNum <= 180) {
      histogramData.C_31_to_60 += 1;
    }
  });

  // transform the data so the max value in the histogram is one
  const maxValue = Math.max(...Object.values(histogramData));
  const maxFraction = maxValue / checkInResults.length;
  const maxFractionRounded = Math.ceil(10 * maxFraction) / 10;

  // console.log(maxValue, maxFraction, maxFractionRounded);

  // update the
  Object.keys(histogramData).forEach((group) => {
    histogramData[group] =
      histogramData[group] / (maxFractionRounded * checkInResults.length);
  });

  // console.log(histogramData);

  // chart parameters
  const chartHeight = 200;
  const chartWidth = width ? Math.min(600, width) : 600;
  const barWidth = chartWidth / 10;
  const gapWidth = (chartWidth - 6 * barWidth) / 12;

  return (
    <>
      <Box px="30px">
        <Box
          ref={chartRef}
          maxW={chartWidth}
          m="auto"
          my="40px"
          borderLeft="2px"
          position="relative"
        >
          {/* label axis */}
          <Heading
            fontSize="16"
            position="absolute"
            top="75"
            left="-20"
            transform="rotate(-90deg)"
          >
            Frequency (%)
          </Heading>
          {/* show the max percent frequency */}
          <Heading fontSize="16" position="absolute" top="0" left="-12">
            {100 * maxFractionRounded}%
          </Heading>
          {/* hash mark */}
          <Box
            position="absolute"
            borderTop="2px"
            w="8px"
            h="2px"
            top="8px"
            left="-8px"
          />
          <svg width={chartWidth} height={chartHeight}>
            <title id="title">
              A bar chart showing the performance of the check in site
            </title>
            {Object.keys(histogramData).map((group, index) => {
              const barHeight = chartHeight * histogramData[group];
              const startOfBar = chartHeight - barHeight;
              const xValue = (index * 2 + 1) * gapWidth + index * barWidth;

              return (
                <g key={index}>
                  <rect
                    width={barWidth}
                    height={barHeight}
                    x={xValue}
                    y={startOfBar}
                    fill={colorMode === "light" ? "black" : "#ffffff"}
                    style={{ color: "#ffffff" }}
                  ></rect>
                </g>
              );
            })}
          </svg>
          <HStack spacing="0px" pt="5px" borderTop="2px solid">
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              A1 - A30
            </Heading>
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              A31 - A60
            </Heading>
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              B1 - B30
            </Heading>
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              B31 - B60
            </Heading>
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              C1 - C30
            </Heading>
            <Heading fontSize={chartWidth > 500 ? "14px" : "10px"} w="100%">
              C31 - C60
            </Heading>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default BarGraph;
