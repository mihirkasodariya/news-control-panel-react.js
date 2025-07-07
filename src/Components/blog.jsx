import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { Plus, Edit } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdClose } from "react-icons/md";

// const BASE_URL =  process.env.BACKEND_URL || "https://admin.techspherebulletin.com";
const BASE_URL = 'https://news-backend-node-js.onrender.com' || "http://localhost:5000";
const Blog = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    blog: "",
    blogContent: [{ text: "" }],
    status: false,
  });
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  // Add these handler functions
  const handleDeleteModalClose = () => setIsDeleteModalOpen(false);

  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleLineChange = (e, field, index) => {
    const updatedContent = [...newCoupon[field]];
    updatedContent[index].text = e.target.value;
    setNewCoupon({ ...newCoupon, [field]: updatedContent });
  };

  const addLine = (field) => {
    setNewCoupon({
      ...newCoupon,
      [field]: [...newCoupon[field], { text: "" }],
    });
  };

  const removeLine = (field, index) => {
    const updatedContent = newCoupon[field].filter((_, i) => i !== index);
    setNewCoupon({
      ...newCoupon,
      [field]: updatedContent,
    });
  };

  useEffect(() => {
    const handleAddOrUpdateCoupon = async () => {
      try {
        const response = await fetch(`${BASE_URL}/blog/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });

        const result = await response.json();
        if (result?.Blogs) {
          setCoupons(result.Blogs);
        } else if (result?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        };
      } catch (error) {
        console.error("Error in API call:", error);
      }
    };
    handleAddOrUpdateCoupon();
  }, [navigate]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleOpen = () => {
    setNewCoupon({ blog: "", blogContent: [{ text: "" }], status: false });
    setEditingId(null);
    setIsChecked(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setNewCoupon({ ...newCoupon, [name]: files[0] }); // Store the file object
    } else if (
      ["blogContent"].includes(name)
    ) {
      setNewCoupon((prev) => ({
        ...prev,
        [name]: [{ text: value }],
      }));

    } else {
      setNewCoupon({ ...newCoupon, [name]: value });
    }
  };



  const handleAddOrUpdateCoupon = async () => {
    if (!newCoupon.blog || !newCoupon.blogContent) {
      alert("Please enter Blog name and content.");
      return;
    }

    const formData = new FormData();
    formData.append("blog", newCoupon.blog);
    ["blogContent"].forEach((field) => {
      newCoupon[field].forEach((item, index) => {
        formData.append(`${field}[${index}][text]`, item.text);
      });
    });
    formData.append("Status", isChecked ? "active" : "inactive");

    if (newCoupon?.image) formData.append("image", newCoupon.image);

    try {
      const url = editingId
        ? `${BASE_URL}/blog/update?id=${editingId}`
        : `${BASE_URL}/blog/create`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          "Authorization": localStorage.getItem("token"),
        },
      });

      const result = await response.json();

      if (result) {
        // Update local state immediately
        if (editingId) {
          // For edit: Update the existing blog in the list
          setCoupons(prevCoupons =>
            prevCoupons.map(coupon =>
              coupon._id === editingId
                ? {
                  ...coupon,
                  blog: newCoupon.blog,
                  blogContent: newCoupon.blogContent,
                  Status: isChecked ? "active" : "inactive",
                  image: newCoupon.image || coupon.image,
                  updatedAt: new Date().toISOString()
                }
                : coupon
            )
          );
        } else {
          // For create: Add the new blog to the list
          if (result.Blog) {
            setCoupons(prevCoupons => [result.Blog, ...prevCoupons]);
          }
        }

        // Reset form and close dialog
        handleClose();
        setNewCoupon({
          blog: "",
          blogContent: [{ text: "" }],
          status: false,
        });
        setIsChecked(false);
        setEditingId(null);

      } else if (result?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      };

    } catch (error) {
      console.error("Error in API call:", error);
      alert("Error updating blog. Please try again.");
    }
  };


  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setNewCoupon({
      image: coupon.image,
      blog: coupon.blog,
      blogContent: coupon.blogContent || [{ text: "" }],
      freeDelivery: coupon.Status,
    });
    setIsChecked(coupon.Status === "active" ? true : false);
    setOpen(true);
  };



  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      const url = `${BASE_URL}/blog/delete?id=${selectedDeleteId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update the local state to remove the deleted item
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon._id !== selectedDeleteId)
        );
        handleDeleteModalClose();
      } else {
        alert("Failed to delete the blog. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCoupons = coupons?.filter((coupon) =>
    coupon?.blog?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <div>
      {message && (
        <Alert severity="info" className="mb-4">
          {message}
        </Alert>
      )}
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
        <div className="flex  justify-between items-center pb-7 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <h2 className="text-2xl font-semibold">Blogs ({coupons.length})</h2>
          <div className="flex items-center flex-col sm:flex-row space-x-4 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <TextField
              label="Search Blogs... &nbsp;&nbsp;&nbsp;&nbsp; &#128269;"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleOpen}
              startIcon={<Plus size={16} />}
            >
              Add New Blogs
            </Button>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start">Sr. No</th>
                <th className="px-6  pl-64 py-3">Blog</th>
                {/* <th className="px-6 py-3">Content</th> */}
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Updated At</th>
                <th className="px-11 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons?.map((coupon, index) => (
                <React.Fragment key={coupon._id}>
                  <tr className="border-b odd:bg-white odd:dark:bg-gray-100 even:bg-gray-50 even:dark:bg-white  dark:border-gray-400 border-gray-200">
                    <td className="px-6 py-4 text-start">{index + 1}</td>
                    <td className="px-6 py-4">{coupon.blog}</td>
                    {/* <td className="px-6 py-4">{coupon.blogContent?.map((item, index) => (
                        <span key={index}>
                          {item.text}
                          <br />
                        </span>
                      ))}{" "}</td> */}
                    <td className="px-6 py-4">{coupon.Status}</td>
                    <td className="px-6 py-4">{new Date(coupon.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">{new Date(coupon.updatedAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4 px-6 py-4 space-x-4">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:underline"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => toggleExpand(coupon._id)}
                        className="text-gray-600 hover:underline"
                      >
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => confirmDelete(coupon._id)}
                        className="text-red-600 hover:underline"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>

                  {expandedId === coupon._id && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                          onClick={() => setExpandedId(null)}
                          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
                        >
                          ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Additional Details:</h2>
                        {coupon.image && (
                          <>
                            <strong>Image:</strong> <br />
                            <img
                              src={`${BASE_URL}/${coupon.image}`} // Adjust the path as per your API
                              alt={coupon.blog}
                              className="w-96 h-80 object-contain  rounded-md mt-2"
                            />
                          </>
                        )}
                        <strong>blogContent:</strong>{" "}
                        {coupon.blogContent?.map((item, index) => (
                          <span key={index}>
                            {item.text}
                            <br />
                          </span>
                        ))}{" "}
                        <br />
                        {/* <strong>Blog Content:</strong> {coupon.blogContent} <br /> */}
                        <strong>Status:</strong> {coupon.Status}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <Dialog open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>
                Are you sure you want to delete this blog? This action cannot be
                undone.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteModalClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{editingId ? "Edit Blog" : "Add New Blog"}</DialogTitle>
          <DialogContent className="grid gap-4">
            <TextField
              fullWidth
              label="Blog"
              name="blog"
              value={newCoupon.blog}
              onChange={handleChange}
              margin="dense"
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">blogContent</label>
                <Button
                  onClick={() => addLine("blogContent")}
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                >
                  Add Line
                </Button>
              </div>
              {newCoupon.blogContent.map((content, index) => (
                <div key={index} className="relative">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={content.text}
                    onChange={(e) => handleLineChange(e, "blogContent", index)}
                    placeholder={`blogContent line ${index + 1}`}
                    variant="outlined"
                  />
                  {newCoupon.blogContent.length > 1 && (
                    <button
                      onClick={() => removeLine("blogContent", index)}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      type="button"
                    >
                      <MdClose
                        className="text-gray-500 hover:text-red-500"
                        size={20}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* <TextField
            fullWidth
            label="Blog Content"
            name="contain" // Changed from "blog" to "contain"
            value={newCoupon.contain}
            onChange={handleChange}
            margin="dense"
          /> */}
            <TextField
              type="file"
              fullWidth
              name="image"
              onChange={handleChange} // Remove `value`
              margin="dense"
              variant="outlined"
              helperText="Upload an image."
            />
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={handleToggle}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600">
                <div
                  className={`absolute top-0.5 start-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-all ${isChecked ? "translate-x-full border-white" : ""
                    }`}
                ></div>
              </div>
              <span className="ms-3 text-sm font-medium text-gray-900">
                {isChecked ? "Active" : "Inactive"}
              </span>
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleAddOrUpdateCoupon}
              variant="contained"
              color="primary"
            >
              {editingId ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Blog;



