import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./chart.css";
import img from "../../assets/eye.png";
import { useEffect } from "react";
import axios from "axios";

const centerTextPlugin = {
  id: "centerTextPlugin",
  afterDraw: (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { top, bottom, left, right } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    // Check if the chart data is empty or if the datasets have no data
    const hasData = chart.data.datasets.some(dataset => dataset.data.some(value => value > 0));

    // Check if the chart should display the "No data available" message
    if (!hasData && chart.options.plugins.centerTextPlugin.showMessage) {
      ctx.save();
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No API Call's Made", centerX, centerY);
      ctx.restore();
    }
  },
};


const Chart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [activeButton, setActiveButton] = useState("Monthly");
  const [textToSpeechResponse, setTextToSpeechResponse] = useState([]);
  const [speechToTextResponse, setSpeechToTextResponse] = useState([]);
  const [gptApiResponse, setGptApiResponse] = useState([]);
  const [textToSpeechDatadates, setTextToSpeechDatadates] = useState([]);
  const [speechToTextDatadates, setSpeechToTextDatadates] = useState([]);
  const [gptApiDatadates, setGptApiDatadates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const textToSpeechData = await axios.get(
          "https://falcon-reality-server.vercel.app/api/textToSpeechApiMonthlyCall"
        );
        const speechToTextData = await axios.get(
          "https://falcon-reality-server.vercel.app/api/speechToTextApiMonthlyCall"
        );
        const gptApiData = await axios.get(
          "https://falcon-reality-server.vercel.app/api/chatGptApiMonthlyCall"
        );

        const textToSpeechDatadates = await axios.get(
          "https://falcon-reality-server.vercel.app/api/textToSpeechApiDailyCall"
        );
        const speechToTextDatadates = await axios.get(
          "https://falcon-reality-server.vercel.app/api/speechToTextApiDailyCall"
        );
        const gptApiDatadates = await axios.get(
          "https://falcon-reality-server.vercel.app/api/chatGptApiDailyCall"
        );

        setTextToSpeechDatadates(textToSpeechDatadates.data);
        setSpeechToTextDatadates(speechToTextDatadates.data);
        setGptApiDatadates(gptApiDatadates.data);

        setTextToSpeechResponse(textToSpeechData.data);
        setSpeechToTextResponse(speechToTextData.data);
        setGptApiResponse(gptApiData.data);

        setData({
          labels: textToSpeechData.data.map((data) => data.months),
          datasets: [
            {
              label: "Text-to-Speech",
              data: textToSpeechData.data.map((data) => data.counts),
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: gptApiData.data.map((data) => data.counts),
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: speechToTextData.data.map((data) => data.counts),
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Duration",
          color: "white",
        },
        ticks: {
          color: "#dedcdc",
        },
      },
      y: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Number of API Calls",
          color: "white",
        },
        ticks: {
          stepSize: 10,
          beginAtZero: true,
          max: 300,
          color: "#dedcdc",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      centerTextPlugin: true,
    },
    animation: {
      duration: 2.6,
    },
    elements: {
      line: {
        borderWidth: 5,
      },
      bar: {
        borderRadius: 15,
      },
    },
  };

  const aggregateData = (dataArray) => {
    return [
      dataArray.slice(0, 3).reduce((a, b) => a + b, 0),
      dataArray.slice(3, 6).reduce((a, b) => a + b, 0),
      dataArray.slice(6, 9).reduce((a, b) => a + b, 0),
      dataArray.slice(9, 12).reduce((a, b) => a + b, 0),
    ];
  };

  const filterData = (type) => {
    if (!textToSpeechResponse || !speechToTextResponse || !gptApiResponse) {
      return;
    }

    setActiveButton(type);
    let filteredData;

    switch (type) {
      case "Today":
        const todayDate = new Date().toLocaleDateString();
        const todayDataIndex = new Date().getDate() % 12;

        filteredData = {
          labels: [todayDate],
          datasets: [
            {
              label: "Text-to-Speech",
              data: [textToSpeechResponse[todayDataIndex]?.counts || 0],
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: [gptApiResponse[todayDataIndex]?.counts || 0],
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: [speechToTextResponse[todayDataIndex]?.counts || 0],
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        };
        break;

      case "Monthly":
        filteredData = {
          labels: textToSpeechResponse.map((data) => data.months),
          datasets: [
            {
              label: "Text-to-Speech",
              data: textToSpeechResponse.map((data) => data.counts),
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: gptApiResponse.map((data) => data.counts),
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: speechToTextResponse.map((data) => data.counts),
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        };
        break;

      case "Quarterly":
        filteredData = {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Text-to-Speech",
              data: aggregateData(
                textToSpeechResponse.map((data) => data.counts)
              ),
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: aggregateData(gptApiResponse.map((data) => data.counts)),
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: aggregateData(
                speechToTextResponse.map((data) => data.counts)
              ),
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        };
        break;

      case "Yearly":
        filteredData = {
          labels: ["2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Text-to-Speech",
              data: [100, 200, 300, 400],
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: [150, 250, 350, 450],
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: [50, 150, 250, 350],
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        };
        break;

      default:
        filteredData = {
          labels: textToSpeechResponse.map((data) => data.months),
          datasets: [
            {
              label: "Text-to-Speech",
              data: textToSpeechResponse.map((data) => data.counts),
              backgroundColor: "#4A2B07",
              borderColor: "#4A2B07",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "GPT API",
              data: gptApiResponse.map((data) => data.counts),
              backgroundColor: "#715739",
              borderColor: "#715739",
              borderWidth: 5,
              fill: false,
            },
            {
              label: "Speech-to-Text",
              data: speechToTextResponse.map((data) => data.counts),
              backgroundColor: "#CFB597",
              borderColor: "#CFB597",
              borderWidth: 5,
              fill: false,
            },
          ],
        };
    }

    console.log("Filtered Data:", filteredData);
    setData(filteredData);
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    if (!start || !end) return;
  
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
  
    // Function to generate dates between two dates
    const generateDateRange = (start, end) => {
      const dates = [];
      let currentDate = new Date(start);
  
      while (currentDate <= end) {
        dates.push(
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(currentDate))
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dates;
    };
  
    const dateRange = generateDateRange(startDate, endDate);
  
    const filteredTextToSpeech = textToSpeechDatadates.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  
    const filteredSpeechToText = speechToTextDatadates.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  
    const filteredGptApi = gptApiDatadates.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  
    // const allDates = [
    //   ...filteredTextToSpeech.map((item) => item.date),
    //   ...filteredSpeechToText.map((item) => item.date),
    //   ...filteredGptApi.map((item) => item.date),
    // ];
  
    // Ensure all dates in the range are accounted for
    const uniqueDates = dateRange;
  
    const textToSpeechData = uniqueDates.map((date) => {
      const item = filteredTextToSpeech.find(
        (item) =>
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(item.date)) === date
      );
      return item ? item.counts : 0;
    });
  
    const gptApiData = uniqueDates.map((date) => {
      const item = filteredGptApi.find(
        (item) =>
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(item.date)) === date
      );
      return item ? item.counts : 0;
    });
  
    const speechToTextData = uniqueDates.map((date) => {
      const item = filteredSpeechToText.find(
        (item) =>
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(item.date)) === date
      );
      return item ? item.counts : 0;
    });
  
    const newData = {
      labels: uniqueDates,
      datasets: [
        {
          label: "Text-to-Speech",
          data: textToSpeechData,
          backgroundColor: "#4A2B07",
          borderColor: "#4A2B07",
          borderWidth: 5,
          fill: false,
          hidden: !textToSpeechData.some(value => value > 0) // Hide if no data
        },
        {
          label: "GPT API",
          data: gptApiData,
          backgroundColor: "#715739",
          borderColor: "#715739",
          borderWidth: 5,
          fill: false,
          hidden: !gptApiData.some(value => value > 0) // Hide if no data
        },
        {
          label: "Speech-to-Text",
          data: speechToTextData,
          backgroundColor: "#CFB597",
          borderColor: "#CFB597",
          borderWidth: 5,
          fill: false,
          hidden: !speechToTextData.some(value => value > 0) // Hide if no data
        },
      ],
    };
  
    // Determine if there's no data in the selected range
    const hasData = newData.datasets.some(dataset => dataset.data.some(value => value > 0));
  
    // Update the chart data and plugin options
    setData(newData);
    setOptions({
      ...options,
      plugins: {
        ...options.plugins,
        centerTextPlugin: {
          ...options.plugins.centerTextPlugin,
          showMessage: !hasData
        },
      },
    });
  };
  
  

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      date <= today ||
      (startDate &&
        date > new Date(startDate).setDate(startDate.getDate() + 31))
    );
  };

  const renderCustomLegend = () => {
    return (
      <div className="custom-legend">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: dataset.borderColor }}
            ></span>
            {dataset.label}
          </div>
        ))}
      </div>
    );
  };
  const [chartOptions, setOptions] = useState(options);

  return (
    <>
      <div className="headings">
        <img src={img} alt="" />
        <h1>API Calls</h1>
      </div>
      <div className="chart-container">
        <div className="controls">
          <div className="legend">{renderCustomLegend()}</div>
          <div className="filter">
            {/* <button
              className={`btns ${activeButton === "Today" ? "active" : ""}`}
              onClick={() => filterData("Today")}
            >
              Daily
            </button> */}
            <button
              className={`btns ${activeButton === "Monthly" ? "active" : ""}`}
              onClick={() => filterData("Monthly")}
            >
              Monthly
            </button>
            <button
              className={`btns ${activeButton === "Quarterly" ? "active" : ""}`}
              onClick={() => filterData("Quarterly")}
            >
              Quarterly
            </button>
            {/* <button
              className={`btns ${activeButton === "Yearly" ? "active" : ""}`}
              onClick={() => filterData("Yearly")}
            >
              Yearly
            </button> */}
          </div>
          <div className="date">
            <DatePicker
              className="date-picker"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleDateChange(date, endDate);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              filterDate={isDateDisabled}
              placeholderText="Start date"
            />
            {" - "}
            <DatePicker
              className="date-picker"
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                handleDateChange(startDate, date);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={
                startDate
                  ? new Date(startDate).setDate(startDate.getDate() + 1)
                  : null
              }
              maxDate={
                startDate
                  ? new Date(startDate).setDate(startDate.getDate() + 31)
                  : null
              }
              filterDate={isDateDisabled}
              placeholderText="End date"
            />
          </div>
        </div>
        <div className="chart">
          {activeButton === "Today" ? (
            <Bar data={data} options={chartOptions} plugins={[centerTextPlugin]} />
          ) : (
            <Line data={data} options={chartOptions} plugins={[centerTextPlugin]} />
          )}
        </div>
      </div>
    </>
  );
};

export default Chart;
