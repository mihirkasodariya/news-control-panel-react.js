import { TextField, Alert } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaEye } from "react-icons/fa";
import icon from "../../src/images/LoadingIcon.png";

// const BASE_URL = process.env.BACKEND_URL || "https://admin.techspherebulletin.com";
const BASE_URL = 'http://192.168.29.225:5000' || "http://localhost:5000";

const User = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/alluser`, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data.userData) {
          setUsers(response.data.userData);
        } else if (response.data?.status == 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          throw new Error("Data format is not correct");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(id);
  };

  if (loading)
    return (
      <div className="w-10 h-10 mt-24 mx-auto flex items-center justify-center">
        <img src={icon} alt="" className="slow-spin" />
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {message && (
        <Alert severity="info" className="mb-4">
          {message}
        </Alert>
      )}
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
        <div className="flex justify-between items-center pb-7 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <h2 className="text-2xl font-semibold">All Users ({users.length})</h2>
          <div className="flex items-center flex-col sm:flex-row space-x-4 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <TextField
              label="Search users... 🔍"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-start">Sr. No</th>
              <th className="px-6 py-3">FirstName</th>
              <th className="px-6 py-3">LastName</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Updated At</th>
              <th className="px-5 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-b bg-white hover:bg-gray-50">
                <td className="px-6 py-4 text-start">{index + 1}</td>
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4">{new Date(user.updatedAt).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleExpand(user._id)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <FaEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {expandedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">User Details</h2>
              {users
                .filter((user) => user._id === expandedId)
                .map((user) => (
                  <div key={user._id}>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p className="mt-2 font-semibold">Followed Categories:</p>
                    <ul className="list-disc ml-5 mb-2">
                      {user.followedCategories.map((category) => (
                        <li key={category._id}>{category.category}</li>
                      ))}
                    </ul>
                    <p className="mt-2 font-semibold">Followed Tags:</p>
                    <ul className="list-disc ml-5">
                      {user.followedtags.map((tag) => (
                        <li key={tag._id}>{tag.tag}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;