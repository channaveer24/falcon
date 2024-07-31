import React from "react";
import axios from "axios";
import io from "socket.io-client";
import { format } from "date-fns";
// import { formatInTimeZone } from 'date-fns-tz';
import { useState, useEffect } from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./table.css";
import img from "../../assets/eye.png";
import exit from "../../assets/exit_to_app.png";
import CustomSelect from "./CustomSelect";


function Table({ columns, data }) {
  const [pageSize, setPageSize] = useState(10);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const pageSizes = [10, 20, 30, 40, 50];

  const handleChange = (increment) => {
    const currentIndex = pageSizes.indexOf(pageSize);
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < pageSizes.length) {
      setPageSize(pageSizes[newIndex]);
    }
  };

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      // width: 100,
      maxWidth: 300,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setPageSiz,
    state: { pageIndex },
    setFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: false,
    },
    useBlockLayout,
    useResizeColumns,
    useFilters,
    usePagination
  );

  React.useEffect(() => {
    setPageSiz(pageSize);
  }, [pageSize, setPageSiz]);

  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [protocolName, setProtocolName] = useState("");

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
    setFilter("user_id", event.target.value);
  };

  const handleProtocolFilter = (filter) => {
    setFilter("response_feedback", filter === "All" ? "" : filter);
  };

  const handleProtocolNameFilter = (selectedValue) => {
    setProtocolName(selectedValue);
    setFilter("protocol_name", selectedValue);
  };


  
  const options = [
      { label: "Catheterization", value: "Catheterization" },
      { label: "Inject", value: "Inject" },
      { label: "Administer Medication", value: "Administer Medication" },
      { label: "Hand Cleaning", value: "Hand Cleaning" },
      { label: "Ostomy Care", value: "Ostomy Care" },
      { label: "Subcutaneous infusion cannula", value: "Subcutaneous infusion cannula" },
      { label: "Blood Glucose", value: "Blood Glucose" },
      { label: "Tube feeding", value: "Tube feeding" },
      { label: "Wound care", value: "Wound care" },
      { label: "Emergency Response", value: "Emergency Response" },
      { label: "Bandages and support stockings", value: "Bandages and support stockings" },
      { label: "All Protocols", value: ""},

    ];

  const [activeFilter, setActiveFilter] = useState("All");

  const handleProtocolFilters = (filter) => {
    setActiveFilter(filter);
  };

  const handleClick = (filter) => {
    handleProtocolFilter(filter);
    handleProtocolFilters(filter);
  };

  const handleCellClick = (row, type) => {
    setPopupContent({ ...row.original, type });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  return (
    <>
      <div className="heading">
        <img src={img} alt="" />
        <h1>Data Collection</h1>
      </div>
      <div className="main-container">
        <div className="main">
          <div className="filters">
            <div className="search-container">
              <i className="bx bx-search search-icon"></i>
              <input
                className="search-input"
                // type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder="User ID"
              />
            </div>
            {/* <div className="dates">
            <DatePicker
              className="date-pickers"
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Select Date Range"
            />
          </div> */}
            <div className="dates">
              <DatePicker
                className="date-pickers"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start date"
              />
              {"-"}
              <DatePicker
                className="date-pickers"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End date"
              />
            </div>

            <div className="reaction">
              <button
                className={`btn ${activeFilter === "All" ? "active" : ""}`}
                onClick={() => handleClick("All")}
              >
                All
              </button>
              <button
                className={`btn ${activeFilter === "Good" ? "active" : ""}`}
                onClick={() => handleClick("Good")}
              >
                Good
              </button>
              <button
                className={`btn ${activeFilter === "Bad" ? "active" : ""}`}
                onClick={() => handleClick("Bad")}
              >
                Bad
              </button>
            </div>
            {/* <div className="custom-select-container">
              <div className="select-wrapper">
                <select
                  className="custom-select"
                  value={protocolName}
                  onChange={handleProtocolNameFilter}
                >
                  <option value="" disabled selected hidden>Protocol Name</option>
                  <option className="custom-option" value="">All Protocols</option>
                  <option className="custom-option" value="x">x</option>
                  <option className="custom-option" value="y">y</option>
                  <option className="custom-option" value="z">z</option>
                </select>
                <img
                  src={arrow}
                  alt="dropdown arrow"
                  className="select-arrow"
                />
              </div>
            </div> */}
            <CustomSelect
              options={options}
              value={protocolName}
              onChange={handleProtocolNameFilter}
              placeholder="Protocol name"
            />

            <button className="export">
              <h5>Export to CSV</h5>
              <img src={exit} alt="" className="bx" />
            </button>
          </div>

          <div className="table-container">
            <div {...getTableProps()} className="table">
              <div className="table_h">
                {headerGroups.map((headerGroup) => (
                  <div {...headerGroup.getHeaderGroupProps()} className="tr">
                    {headerGroup.headers.map((column) => (
                      <div
                        {...column.getHeaderProps()}
                        className="th"
                        style={{
                          flex: column.width,
                        }}
                      >
                        {column.render("Header")}
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${
                            column.isResizing ? "isResizing" : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="table_td">
                <div {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <div {...row.getRowProps()} className="tr">
                        {row.cells.map((cell, cellIndex) => {
                          const isLastColumn =
                            cellIndex === row.cells.length - 1;
                          let backgroundColor;
                          if (cell.column.id === "response_feedback") {
                            if (cell.value === "Good") {
                              backgroundColor = "#E0FFE5";
                            } else if (cell.value === "Bad") {
                              backgroundColor = "#FFEFEF";
                            }
                            // backgroundColor =
                            //   if(cell.value === "Good" ? "#E0FFE5" : "#FFEFEF";
                          }
                          return (
                            <div
                              {...cell.getCellProps()}
                              className={`td ${
                                isLastColumn ? "last-column" : ""
                              }`}
                              style={{
                                flex: cell.column.width,
                                backgroundColor: backgroundColor || undefined,
                                borderRadius: "5px",
                              }}
                              onClick={() =>
                                handleCellClick(row, cell.column.id)
                              }
                            >
                              {cell.render("Cell")}
                              <div
                                {...cell.column.getResizerProps()}
                                className={`resizer ${
                                  cell.column.isResizing ? "isResizing" : ""
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pagination">
        <div className="pages">
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bxs-left-arrow"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          ></i>
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bx-chevron-left"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          ></i>
          <span>
            <strong style={{ color: "#463C30" }}>
              {pageIndex + 1} / {pageOptions.length}
            </strong>
          </span>
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bx-chevron-right"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          ></i>
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bxs-right-arrow"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          ></i>
        </div>

        <div className="pagesize">
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bx-chevron-left"
            onClick={() => handleChange(-1)}
            disabled={pageSize === pageSizes[0]}
          ></i>
          <span style={{ color: "#463C30" }}>{` ${pageSize} `}</span>
          <i
            style={{ color: "#7D7C7C" }}
            className="bx bx-chevron-right"
            onClick={() => handleChange(1)}
            disabled={pageSize === pageSizes[pageSizes.length - 1]}
          ></i>
        </div>
      </div>


      {showPopup && (
  <div className="popup-overlay" onClick={closePopup}>
    <div className="popup">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="pop-close">
          <div className="popup-details">
            <div className="popup-pro">
              <i className="bx bx-category"></i>
              <div style={{ fontSize: "20px", marginBottom: "5px" }}>
                {popupContent.protocol_name}
              </div>
            </div>
            <div className="popup-id">
              <i className="bx bx-user-circle"></i>
              {popupContent.user_id}
            </div>
            <div className="popup-date" style={{ color: "#777777" }}>
              {popupContent.dateTime}
            </div>

            {(() => {
              let textColor, backgroundColor;

              if (popupContent.response_feedback === "Good") {
                textColor = "green";
                backgroundColor = "#E0FFE5";
              } else if (popupContent.response_feedback === "Bad") {
                textColor = "red";
                backgroundColor = "#FFEFEF";
              } else {
                textColor = "#575757";
                backgroundColor = "#F2F2F2";
              }

              return (
                <div
                  className="popup-reaction"
                  style={{
                    color: textColor,
                    backgroundColor: backgroundColor,
                    fontSize: "14px",
                  }}
                >
                  {popupContent.response_feedback}
                </div>
              );
            })()}
          </div>
          <i className="bx bx-x" onClick={closePopup}></i>
        </div>

        <div className="popup-question">
          <span>Question:</span> <br />
          <div className="pop-row">{popupContent.request}</div>
        </div>

        <div className="popup-answer">
          <span>Answer:</span> <br />
          <div className="pop-row">{popupContent.response}</div>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://falconreality.onrender.com/api/getChatdata"
        );
        // const result = await axios.get(
        //   "http://localhost:8800/api/getChatData"
        // );
        const formattedData = result.data.map((item) => {
          const utcDate = new Date(item.date_time);
          const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000); 
          const formattedDate = format(localDate, 'MMM/dd/yyyy hh:mm a');
          
          return {
            ...item,
            dateTime: formattedDate,
          };
        });
        setData(formattedData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();

    const ENDPOINT = "http://localhost:5000";

    const socket = io(ENDPOINT, {
      transports: ['websocket'],
    });

    socket.on("newMessage", (newData) => {
      const utcDate = new Date(newData.date_time);
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000); 
      const formattedDate = format(localDate, 'MMM/dd/yyyy hh:mm a');
      const formattedNewData = {
        ...newData,
        dateTime: formattedDate,
      };
      setData((prevData) => [formattedNewData, ...prevData]);
    });

    return () => {
      socket.off("newMessage");
    };
 
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "user_id",
        width: 150,
        minWidth: 100,
        maxWidth: 300,
        resizable: true,
      },
      {
        Header: "Date / Time",
        accessor: "dateTime",
        width: 200,
        minWidth: 150,
        maxWidth: 400,
        resizable: true,
      },
      {
        Header: "Questions",
        accessor: "request",
        width: 300,
        minWidth: 200,
        maxWidth: 600,
        resizable: true,
      },
      {
        Header: "Answers",
        accessor: "response",
        width: 300,
        minWidth: 200,
        maxWidth: 600,
        resizable: true,
      },
      {
        Header: "Protocol Name",
        accessor: "protocol_name",
        width: 200,
        minWidth: 150,
        maxWidth: 400,
        resizable: true,
      },

      {
        Header: "Reactions",
        accessor: "response_feedback",
        width: 100,
        minWidth: 100,
        maxWidth: 300,
        resizable: true,
        Cell: ({ value }) => {
          let color;
          if (value === "Good") {
            color = "green";
          } else if (value === "Bad") {
            color = "red";
          } else {
            color = "#575757";
          }
          return (
            <div
              style={{
                color: color,
              }}
            >
              {value}
            </div>
          );
        },
      },
    ],
    []
  );

  return(
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
  
}

export default App;
