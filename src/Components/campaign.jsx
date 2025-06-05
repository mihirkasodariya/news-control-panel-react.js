// import React, { useState } from "react";
// import { TextField, Alert } from "@mui/material";

// const CampaignStatsTable = () => {
//   // Sample campaign data
//   const staticCampaigns = [
//     { _id: "1", campaignName: "User Growth", budget: 50000, reach: 175000, userCount: 15 },
//   ];

//   const [searchQuery, setSearchQuery] = useState("");
//   const [message, setMessage] = useState("");

//   // Filter campaigns based on search input
//   const filteredCampaigns = staticCampaigns.filter((campaign) =>
//     campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       {message && (
//         <Alert severity="info" className="mb-4">
//           {message}
//         </Alert>
//       )}

//       <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
//         <div className="flex justify-between items-center pb-7 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//           <h2 className="text-2xl font-semibold">
//             Campaigns ({staticCampaigns.length})
//           </h2>
//           <div className="flex items-center flex-col sm:flex-row space-x-4 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//             <TextField
//               label="Search campaigns... 🔍"
//               variant="outlined"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               size="small"
//             />
//           </div>
//         </div>

//         <table className="w-full text-sm text-left text-gray-500">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//             <tr>
//               <th className="px-6 py-4">Sr. No</th>
//               <th className="px-6 py-3">Campaign Name</th>
//               <th className="px-6 py-3">Budget</th>
//               <th className="px-6 py-3">Reach</th>
//               <th className="px-6 py-3">User Count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCampaigns.map((campaign, index) => (
//               <tr key={campaign._id} className="border-b bg-white hover:bg-gray-50">
//                 <td className="px-6 py-4">{index + 1}</td>
//                 <td className="px-6 py-4">{campaign.campaignName}</td>
//                 <td className="px-6 py-4">{campaign.budget}</td>
//                 <td className="px-6 py-4">{campaign.reach.toLocaleString()}</td>
//                 <td className="px-6 py-4">{campaign.userCount.toLocaleString()}</td>
//               </tr>
//             ))}

//             {filteredCampaigns.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="text-center py-4 text-gray-500">
//                   No campaigns found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CampaignStatsTable;
