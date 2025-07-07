import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
// import Datepicker from "react-tailwindcss-datepicker";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { PieChart } from "react-minimal-pie-chart";

// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup,
// } from "react-simple-maps";
import { Minus, Plus } from "lucide-react";

//country map

// const geoUrl =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const countryData = [
  { id: "USA", name: "United States", value: 35, gdp: 14624.18, flag: "🇺🇸" },
  { id: "CAN", name: "Canada", value: 26, gdp: 1700.56, flag: "🇨🇦" },
  { id: "FRA", name: "France", value: 18, gdp: 2603.0, flag: "🇫🇷" },
  { id: "ITA", name: "Italy", value: 14, gdp: 1886.45, flag: "🇮🇹" },
  { id: "AUS", name: "Australia", value: 10, gdp: 1323.42, flag: "🇦🇺" },
  { id: "GER", name: "Germany", value: 9, gdp: 3845.63, flag: "🇩🇪" },
];

//category
const products = [
  {
    id: 1,
    name: "Text to Landing Page",
    usage: "60%",
  },
  {
    id: 2,
    name: "Text to Image",
    usage: "25%",
  },
  {
    id: 3,
    name: 'Text to Text',
    usage: "15%",
  },
];

// users
const users = [
  {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    email: 'john.doe@example.com',
    usage: 150,
  },
  {
    id: 2,
    fname: 'Emily',
    lname: 'Smith',
    email: 'emily.smith@example.com',
    usage: 120,
  },
  {
    id: 3,
    fname: 'Michael',
    lname: 'Johnson',
    email: 'michael.johnson@example.com',
    usage: 180,
  },
  {
    id: 4,
    fname: 'Olivia',
    lname: 'Brown',
    email: 'olivia.brown@example.com',
    usage: 200,
  },
  {
    id: 5,
    fname: 'William',
    lname: 'Davis',
    email: 'william.davis@example.com',
    usage: 130,
  },
  {
    id: 5,
    fname: 'William',
    lname: 'Davis',
    email: 'william.davis@example.com',
    usage: 130,
  }
];


const bestUsers = [
  {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    email: 'john.doe@example.com',
    usage: 150,
  },
  {
    id: 2,
    fname: 'Emily',
    lname: 'Smith',
    email: 'emily.smith@example.com',
    usage: 120,
  },
  {
    id: 3,
    fname: 'Michael',
    lname: 'Johnson',
    email: 'michael.johnson@example.com',
    usage: 180,
  },
  {
    id: 4,
    fname: 'Olivia',
    lname: 'Brown',
    email: 'olivia.brown@example.com',
    usage: 200,
  },
  {
    id: 5,
    fname: 'William',
    lname: 'Davis',
    email: 'william.davis@example.com',
    usage: 130,
  },
  {
    id: 5,
    fname: 'William',
    lname: 'Davis',
    email: 'william.davis@example.com',
    usage: 130,
  }
];

const pieDataSet = {
  today: [
    { title: "New", value: 15333, color: "oklch(0.789 0.154 211.53)" },       // ≈ 15333
    { title: "Returning", value: 30667, color: "oklch(0.609 0.126 221.723)" }, // ≈ 30667
    { title: "Referral", value: 30667, color: "oklch(0.282 0.091 267.935)" },  // ≈ 30667
    { title: "Social", value: 38333, color: "oklch(0.702 0.183 293.541)" },    // ≈ 38333
  ],
  last7Day: [
    { title: "New", value: 32143, color: "oklch(0.789 0.154 211.53)" },
    { title: "Returning", value: 64286, color: "oklch(0.609 0.126 221.723)" },
    { title: "Referral", value: 21429, color: "oklch(0.282 0.091 267.935)" },
    { title: "Social", value: 32143, color: "oklch(0.702 0.183 293.541)" },
  ],

  lastMonth: [
    { title: "New", value: 1108375, color: "oklch(0.789 0.154 211.53)" },
    { title: "Returning", value: 1849882, color: "oklch(0.609 0.126 221.723)" },
    { title: "Referral", value: 665025, color: "oklch(0.282 0.091 267.935)" },
    { title: "Social", value: 886700, color: "oklch(0.702 0.183 293.541)" },
  ]
};

// Calculate total visitors for each range
const totalVisitors = {
  today: pieDataSet.today.reduce((acc, curr) => acc + curr.value, 0),
  last7Day: pieDataSet.last7Day.reduce((acc, curr) => acc + curr.value, 0),
  lastMonth: pieDataSet.lastMonth.reduce((acc, curr) => acc + curr.value, 0),
};
//date picker

const NEXT_MONTH = new Date();
NEXT_MONTH.setMonth(NEXT_MONTH.getMonth() + 1);

// graph bar
// const data = [
//   { name: '1', uv: 4000, pv: 400, amt: 2400 },
//   { name: '2', uv: 3000, pv: 200, amt: 2210 },
//   { name: '3', uv: 2000, pv: 100, amt: 2290 },
//   { name: '4', uv: 2780, pv: 300, amt: 2000 },
//   { name: '5', uv: 1890, pv: 200, amt: 2181 },
//   { name: '6', uv: 2390, pv: 500, amt: 2500 },
//   { name: '7', uv: 3490, pv: 600, amt: 2100 },
// ];

const data = Array.from({ length: 30 }, (_, i) => ({
  name: (i + 1).toString(),
  uv: Math.floor(Math.random() * 5000) + 1000,
  pv: Math.floor(Math.random() * 1000) + 100,
  amt: Math.floor(Math.random() * 3000) + 2000,
}));

const cardData = [
  {
    title: "Total User",
    count: "206",
    iconColor: "text-green-500 ",
    iconPath: "16%",
  },
  {
    title: "Total New User",
    count: "15",
    iconColor: "text-green-500",
    iconPath: "12%",
  },
  {
    title: "Total Visitors",
    count: "1.75K",
    iconColor: "text-teal-500 ",
    iconPath: "7%",
  }
];

const getIntroOfPage = (label) => {
  const descriptions = {
    1: "Page 1 is about men's clothing",
    2: "Page 2 is about women's dress",
    3: "Page 3 is about women's bag",
    4: "Page 4 is about household goods",
    5: "Page 5 is about food",
    6: "Page 6 is about baby food",
  };
  return descriptions[label] || "";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        <p className="intro">{getIntroOfPage(label)}</p>
        <p className="desc">Anything you want can be displayed here.</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState("today");

  // const [value, setValue] = useState({
  //   startDate: new Date(),
  //   endDate: NEXT_MONTH,
  // });

  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom * 1.5, 10)); // Prevent excessive zoom
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom / 1.5, 1)); // Prevent excessive zoom out
  };

  return (
    <div className="sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
      <div className="bg-slate-100 pb-4">
        {/* datepicker */}
        <div className="sm:w-72 w-64 py-7 px-2">
          {/* <Datepicker
            primaryColor={"indigo"}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            showShortcuts={true}
            theme="light"
            classNames="custom-datepicker"
            // style={{ backgroundColor: "lightblue" }}
          /> */}
        </div>
        {/* barchart */}
        <div className="py-10">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="pv" barSize={20} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* counterCard */}
        <div className="">
          <div className="py-5 ">
            <main className="h-full overflow-y-auto  mx-5">
              <div className=" mx-auto grid ">
                <div className="grid  my-2 md:grid-cols-2 xl:grid-cols-3">
                  {cardData.map((card, index) => (
                    <div
                      key={index}
                      className="flex items-center p-8 bg-white border-r sm:border-gray-400 sm:border-r"
                    >
                      <div className=" mx-auto">
                        <div className="flex gap-2 items-baseline">
                          <p className="sm:text-3xl text-2xl font-bold text-gray-900 ">
                            {card.count}
                          </p>
                          <div
                            className={`p-3  mr-4 rounded-full ${card.iconColor}`}
                          >
                            <p>{card.iconPath}</p>
                          </div>
                        </div>
                        <p className=" text-base font-semibold text-gray-600">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
        {/* countrymap */}
        <div className="m-5">
          <div className="flex grid-cols-1 md:grid-cols-2 lg:grid-flow-col lg:grid-rows-[auto,auto] gap-4 md:gap-6 lg:gap-7 pb-2 ">
            {/* Top Countries Section */}
            <div className="row-span-6 bg-white p-4 md:p-6 h-fit w-full max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-[70px]">
                <h2 className="!text-lg lg:!text-2xl py-2 font-bold">
                  Top Countries
                </h2>
                <select className="w-full md:w-[180px] border border-gray-300 rounded-lg px-3 py-2">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              {/* Map Section */}
              <div className="relative mt-4 md:mt-6">
                <ComposableMap>
                  <ZoomableGroup zoom={zoom}>
                    <Geographies geography="/features.json">
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                              default: { fill: "#8884d8" },
                              hover: { fill: "oklch(0.872 0.01 258.338)" },
                              pressed: { fill: "oklch(0.872 0.01 258.338)" },
                            }}
                          />
                        ))
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>

                {/* Zoom Buttons */}
                <div className="absolute bottom-2 left-2 flex gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="bg-white border border-gray-300 p-2 rounded-md shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="bg-white border border-gray-300 p-2 rounded-md shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Country Data List */}
              <div className="space-y-3 mt-4 md:mt-6 ">
                {countryData.map((country) => (
                  <div key={country.id} className="flex items-center ">
                    <span className="w-6 md:w-8 text-sm  lg:text-xl">
                      {country.flag}
                    </span>
                    <span className="w-28 md:w-32 text-sm  lg:text-xl">
                      {country.name}
                    </span>
                    <div className="relative flex-1 h-4 lg:h-8 bg-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-[#8884d8] transition-all relative"
                        style={{ width: `${country.value}%` }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] lg:text-sm font-semibold">
                          {country.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-7">
              <div className="bg-white p-4 md:p-6">
                <div className="pb-2 lg:pb-4">
                  <h1 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-900">
                    Trandding Tool's
                  </h1>
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full h-fit text-sm text-left text-gray-900">
                    <thead className="text-xs text-gray-900 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px]">
                          {/* <th className="px-4 md:px-6 py-2 lg:py-6 "> */}
                          Tool name
                        </th>
                        <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px]">Trending Usage</th>
                        {/* <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px]">Category</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className="bg-white border-b border-gray-200"
                        >
                          <th
                            scope="row"
                            className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px] font-medium text-gray-900 whitespace-nowrap"
                          >
                            {product.name}
                          </th>
                          <td className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px]">
                            {product.usage}
                          </td>
                          {/* <td className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px]">
                          {product.category}
                        </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Tags Section */}
              <div className="bg-white p-4 md:p-6">
                <div className="pb-2 lg:pb-4">
                  <h1 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-900">
                    Top User's
                  </h1>
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-900">
                    <thead className="text-xs text-gray-900 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px]">First Name</th>
                        <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px]">Last Name</th>
                        <th className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px]">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          className="bg-white border-b border-gray-200"
                        >
                          <th
                            scope="row"
                            className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px] font-medium text-gray-900 whitespace-nowrap"
                          >
                            {user.fname}
                          </th>
                          <td className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px] font-medium text-gray-900 whitespace-nowrap">
                            {user.lname}
                          </td>
                          <td className="px-4 md:px-6 py-2 md:py-1 lg:py-[9px] xl:py-[15px] 2xl:py-[23px] font-medium text-gray-900 whitespace-nowrap">
                            {user.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            {/* Top Categories Section */}
          </div>
        </div>
        {/* piechart */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 m-5">
            <div className="col-span-1 bg-white p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4">
                <h2 className="!text-base lg:!text-2xl py-2 font-bold">
                  Visitors Analytics
                </h2>
                <select
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value)}
                  className="w-full lg:w-[120px] border text-sm border-gray-300 rounded-lg px-2 py-2"
                >
                  <option value="lastMonth">Last Month</option>
                  <option value="last7Day">Last 7 Day</option>
                  <option value="today">Today</option>
                </select>
              </div>

              <div className="w-fit py-10 mx-auto relative">
                <PieChart
                  key={selectedRange}
                  data={pieDataSet[selectedRange]}
                  lineWidth={30}
                  paddingAngle={2}
                  animate={true}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                  labelStyle={{
                    fontSize: "5px",
                    fill: "#fff",
                  }}
                  labelPosition={85}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "gray",
                    display: "grid",
                    justifyItems: "center",
                  }}
                >
                  <p className="text-gray-900 text-4xl">{totalVisitors[selectedRange]}</p>
                  Visitors
                </div>
              </div>

              {/* Visitors sources list below pie chart */}
              <div>
                {pieDataSet[selectedRange].map(({ title, value, color }) => (
                  <div key={title} className="flex items-center text-sm space-x-3">
                    <div
                      style={{ backgroundColor: color }}
                      className="w-3.5 h-3.5 rounded-full"
                    ></div>
                    <span className="font-medium">{title}</span>
                    <span className="text-gray-600">- {value}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Top news */}
            <div className="col-span-1 md:col-span-2 bg-white p-4">
              <div className="pb-2 lg:pb-4">
                <h1 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-900">
                  Best User's
                </h1>
              </div>

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-900">
                  <thead className="text-xs text-gray-900 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-4 lg:py-6">First Name</th>
                      <th className="px-4 md:px-6 py-4 lg:py-6">Last Name</th>
                      <th className="px-4 md:px-6 py-4 lg:py-6">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestUsers.map((bstUser, index) => (
                      <tr
                        key={bstUser.id}
                        className="bg-white border-b border-gray-200"
                      >
                        <th
                          scope="row"
                          className="px-4 md:px-6 py-4 lg:py-6 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {bstUser.fname}
                        </th>
                        <td className="px-4 md:px-6 py-4 lg:py-6">
                          {bstUser.lname}
                        </td>
                        <td className="px-4 md:px-6 py-4 lg:py-6">
                          {bstUser.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// {
  /* <PieChart
                  key={Date.now()}
                  data={[
                    { title: "One", value: 10, color: "#E38627" },
                    { title: "Two", value: 15, color: "#C13C37" },
                    { title: "Three", value: 20, color: "#6A2135" },
                    { title: "Four", value: 30, color: "#8884d8" },
                  ]}
                  lineWidth={30}
                  paddingAngle={2}
                  animate={true}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  label={({ dataEntry }) => `${dataEntry.value}%`}
                  labelStyle={{
                    fontSize: '5px',  
                    fill: '#fff' ,
                  }}
                  labelPosition={85} 
                /> */
// }
