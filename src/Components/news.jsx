import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
} from "@mui/material";
import { Plus, Edit } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdClose } from "react-icons/md";

// const BASE_URL =  process.env.BACKEND_URL || "https://admin.techspherebulletin.com";
const BASE_URL = 'https://news-backend-node-js.onrender.com' || "http://localhost:5000";

const News = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    title: "",
    summary: [{ text: "" }],
    content_1: [{ text: "" }],
    content_2: [{ text: "" }],
    content_3: [{ text: "" }],
    Status: "",
    categoryId: "",
    tagId: "",
    NewsDate: "",
    heroimage: "",
    image_2: "",
    image_3: "",
  });
  const [expandedId, setExpandedId] = useState(null); // State to handle expanded view
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal
  const [selectedDeleteId, setSelectedDeleteId] = useState(null); // ID for deletion
  const [categories, setCategories] = useState([]);
  const [tags, settags] = useState([]);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const handleDeleteModalClose = () => setIsDeleteModalOpen(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });

        const result = await response.json();
        if (result?.Categorys) {
          setCategories(result.Categorys);
        } else if (result?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        };
        // Assuming API returns an array of categories, update state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchtags = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tag/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });

        const result = await response.json();
        if (result?.Tags) {
          settags(result.Tags);
        } else if (result?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        };
        // Assuming API returns an array of tags, update state
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchtags();
    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    const handleAddOrUpdateCoupon = async () => {
      try {
        const response = await fetch(`${BASE_URL}/news/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (result?.News) {
          setCoupons(result.News);
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
    setNewCoupon({
      title: "",
      summary: [{ text: "" }],
      content_1: [{ text: "" }],
      content_2: [{ text: "" }],
      content_3: [{ text: "" }],
      Status: false,
      categoryId: "",
      tagId: "",
      NewsDate: "",
      heroimage: "",
      image_2: "",
      image_3: "",
    });
    setEditingId(null);
    setIsChecked(false);
    setIsCategorySelected(false); // Reset category selection state
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "categoryId") {
      // Update category selected state
      setIsCategorySelected(!!value);
      // Filter tags based on category if needed
      // You can add logic here to filter tags based on category
    }

    if (type === "file") {
      if (files && files[0]) {
        setNewCoupon((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else if (
      ["summary", "content_1", "content_2", "content_3"].includes(name)
    ) {
      setNewCoupon((prev) => ({
        ...prev,
        [name]: [{ text: value }],
      }));
    } else {
      setNewCoupon((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleAddOrUpdateCoupon = async () => {
    const formData = new FormData();

    // Append basic text fields
    formData.append("title", newCoupon.title);

    // Handle arrays of content
    ["summary", "content_1", "content_2", "content_3"].forEach((field) => {
      newCoupon[field].forEach((item, index) => {
        formData.append(`${field}[${index}][text]`, item.text);
      });
    });

    // Format date properly
    const formattedDate = newCoupon.NewsDate
      ? new Date(newCoupon.NewsDate).toISOString().split("T")[0]
      : "";
    formData.append("NewsDate", formattedDate);

    // Append other fields
    formData.append("categoryId", newCoupon.categoryId);
    formData.append("tagId", newCoupon.tagId);
    formData.append("Status", isChecked ? "active" : "inactive");

    // Handle image uploads or keep existing images
    if (newCoupon.heroimage instanceof File) {
      formData.append("heroimage", newCoupon.heroimage);
    } else if (newCoupon.heroimage) {
      formData.append("heroimage", newCoupon.heroimage); // Send existing image path
    }

    if (newCoupon.image_2 instanceof File) {
      formData.append("image_2", newCoupon.image_2);
    } else if (newCoupon.image_2) {
      formData.append("image_2", newCoupon.image_2);
    }

    if (newCoupon.image_3 instanceof File) {
      formData.append("image_3", newCoupon.image_3);
    } else if (newCoupon.image_3) {
      formData.append("image_3", newCoupon.image_3);
    }

    try {
      const url = editingId
        ? `${BASE_URL}/news/update?id=${editingId}`
        : `${BASE_URL}/news/create`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
        headers: {
          "Authorization": localStorage.getItem("token"),
        }
      });

      const result = await response.json();
      if (result) {
        // Refresh the list after successful operation
        const updatedResponse = await fetch(`${BASE_URL}/news/all`, {
          method: "GET", // Optional, default is GET
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        const updatedData = await updatedResponse.json();
        setCoupons(updatedData.News);
      } else if (result?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      };
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setNewCoupon({
      ...coupon,
      // Convert date to YYYY-MM-DD format for the input field
      NewsDate: coupon.NewsDate
        ? new Date(coupon.NewsDate).toISOString().split("T")[0]
        : "",
      // Don't set image fields directly, they will be handled by file inputs
      heroimage: coupon.heroimage,
      image_2: coupon.image_2,
      image_3: coupon.image_3,
    });
    setIsChecked(coupon.Status === "active");
    setIsCategorySelected(!!coupon.categoryId); // Set category selection state
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      const url = `${BASE_URL}/news/delete?id=${selectedDeleteId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
      });
      console.log('response.ok', response.ok)
      if (response.ok) {
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon._id !== selectedDeleteId)
        );
        handleDeleteModalClose();
      }
      // else if (response.ok?.status == 401) {
      //   setMessage("Your session has expired. Please log in again to continue.");
      //   navigate("/login");
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("user");
      // } 
      else {
        setMessage("Failed to delete the news article. Please try again.");
      };
    } catch (error) {
      console.error("Error deleting news article:", error);
      alert("An error occurred while deleting the news article.");
    }
  };
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id); // Toggle expand/collapse
  };

  const filteredNews = coupons?.filter((coupon) =>
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };
  const getCurrentDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate()); // This sets max date to today
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div>
      {message && (
        <Alert severity="info" className="mb-4">
          {message}
        </Alert>
      )}
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
        <div className="flex justify-between items-center pb-4 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <h2 className="text-2xl font-semibold">News ({coupons?.length})</h2>
          <div className="flex items-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <TextField
              label="Search by title... &#128269;"
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
              Add Latest News
            </Button>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-2  py-3 text-start">Sr. No</th>
                <th className="px-2 pl-64 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-3 pl-6 py-3">Created At</th>
                <th className="px-3 pl-6 py-3">Updated At</th>
                <th className="px-11 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews?.map((coupon, index) => (
                <React.Fragment key={coupon._id}>
                  <tr className="border-b odd:bg-white odd:dark:bg-gray-100 even:bg-gray-50 even:dark:bg-white dark:border-gray-400 border-gray-200">
                    <td className="px-6 py-4 text-start">{index + 1}</td>
                    <td className="px-6  pl-10 py-4">{coupon.title}</td>
                    <td className="px-6 py-4">{categories.find((cat) => cat._id === coupon.categoryId)
                      ?.category || "N/A"}{" "}</td>
                    <td className="px-6 py-4">{tags.find((tag) => tag._id === coupon.tagId)?.tag ||
                      "N/A"}{" "}</td>
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
                        // onClick={() => handleDelete(coupon._id)}
                        onClick={() => confirmDelete(coupon._id)}
                        className="text-red-600 hover:underline"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>

                  {expandedId === coupon._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[900px] max-h-[90vh]">

                        {/* Fixed Close Button */}
                        <button
                          onClick={() => setExpandedId(null)}
                          className="absolute top-3 right-8 text-gray-600 hover:text-black text-xl font-bold z-10"
                        >
                          ✕
                        </button>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto max-h-[90vh] pt-8">
                          <h2 className="text-2xl font-bold mb-4 text-gray-700">Additional Details:</h2>
                          <strong>Title:</strong> {coupon.title} <br />
                          <strong>Summary:</strong>{" "}
                          {coupon.summary?.map((item, index) => (
                            <span key={index}>
                              {item.text}
                              <br />
                            </span>
                          ))} <br />
                          {coupon.heroimage && (
                            <>
                              <strong>Image:</strong> <br />
                              <img
                                src={`${BASE_URL}/${coupon.heroimage}`}
                                alt={coupon.title}
                                className="w-96 h-80 object-contain rounded-md mt-2"
                              />
                            </>
                          )}<br />
                          <strong>Content 1:</strong>{" "}
                          {coupon.content_1?.map((item, index) => (
                            <span key={index}>
                              {item.text}
                              <br />
                            </span>
                          ))} <br />
                          <strong>Content 2:</strong>{" "}
                          {coupon.content_2?.map((item, index) => (
                            <span key={index}>
                              {item.text}
                              <br />
                            </span>
                          ))} <br />
                          {coupon.image_2 && (
                            <>
                              <strong>Image:</strong> <br />
                              <img
                                src={`${BASE_URL}/${coupon.image_2}`}
                                alt={coupon.title}
                                className="w-96 h-80 object-contain rounded-md mt-2"
                              />
                            </>
                          )}<br />
                          <strong>Content 3:</strong>{" "}
                          {coupon.content_3?.map((item, index) => (
                            <span key={index}>
                              {item.text}
                              <br />
                            </span>
                          ))} <br />
                          {coupon.image_3 && (
                            <>
                              <strong>Image:</strong> <br />
                              <img
                                src={`${BASE_URL}/${coupon.image_3}`}
                                alt={coupon.title}
                                className="w-96 h-80 object-contain rounded-md mt-2"
                              />
                            </>
                          )}<br />
                          <strong>Category:</strong>{" "}
                          {categories.find((cat) => cat._id === coupon.categoryId)?.category || "N/A"} <br />
                          <strong>Tag:</strong>{" "}
                          {tags.find((tag) => tag._id === coupon.tagId)?.tag || "N/A"} <br />
                          <strong>Status:</strong> {coupon.Status} <br />
                        </div>
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
                Are you sure you want to delete this News? This action cannot be
                undone.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteModalClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Yes, Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* Dialog for adding/editing news */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <span className="text-xl font-semibold">
              {editingId ? "Edit News" : "Add New News"}
            </span>
          </DialogTitle>
          <DialogContent
            className="grid gap-4 p-6"
            style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newCoupon.title}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              helperText="Provide the title of the news article."
              required
            />
            <TextField
              type="file"
              fullWidth
              name="heroimage"
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              helperText="Upload an heroimage."
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">Summary</label>
                <Button
                  onClick={() => addLine("summary")}
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                >
                  Add Line
                </Button>
              </div>
              {newCoupon.summary.map((content, index) => (
                <div key={index} className="relative">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={content.text}
                    onChange={(e) => handleLineChange(e, "summary", index)}
                    placeholder={`Summary line ${index + 1}`}
                    variant="outlined"
                  />
                  {newCoupon.summary.length > 1 && (
                    <button
                      onClick={() => removeLine("summary", index)}
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
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">Content 1</label>
                <Button
                  onClick={() => addLine("content_1")}
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                >
                  Add Line
                </Button>
              </div>
              {newCoupon.content_1.map((content, index) => (
                <div key={index} className="relative">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={content.text}
                    onChange={(e) => handleLineChange(e, "content_1", index)}
                    placeholder={`Content line ${index + 1}`}
                    variant="outlined"
                  />
                  {newCoupon.content_1.length > 1 && (
                    <button
                      onClick={() => removeLine("content_1", index)}
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
            <TextField
              type="file"
              fullWidth
              name="image_2"
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              helperText="Upload an image_2."
            />
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">Content 2</label>
                <Button
                  onClick={() => addLine("content_2")}
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                >
                  Add Line
                </Button>
              </div>
              {newCoupon.content_2.map((content, index) => (
                <div key={index} className="relative">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={content.text}
                    onChange={(e) => handleLineChange(e, "content_2", index)}
                    placeholder={`Content line ${index + 1}`}
                    variant="outlined"
                  />
                  {newCoupon.content_2.length > 1 && (
                    <button
                      onClick={() => removeLine("content_2", index)}
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
            <TextField
              type="file"
              fullWidth
              name="image_3"
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              helperText="Upload an image_3."
            />
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">Content 3</label>
                <Button
                  onClick={() => addLine("content_3")}
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                >
                  Add Line
                </Button>
              </div>
              {newCoupon.content_3.map((content, index) => (
                <div key={index} className="relative">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={content.text}
                    onChange={(e) => handleLineChange(e, "content_3", index)}
                    placeholder={`Content line ${index + 1}`}
                    variant="outlined"
                  />
                  {newCoupon.content_3.length > 1 && (
                    <button
                      onClick={() => removeLine("content_3", index)}
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
            <TextField
              fullWidth
              label="News Date"
              type="date"
              name="NewsDate"
              value={newCoupon.NewsDate}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: getCurrentDate(), // This sets the minimum date to today
              }}
              helperText="Set the date for the news article."
              required
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={newCoupon.categoryId}
                onChange={handleChange}
                label="Category"
              >
                {categories?.map((val) => (
                  <MenuItem key={val._id} value={val._id}>
                    {val.category}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select a category for the news article.
              </FormHelperText>
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              variant="outlined"
              disabled={!isCategorySelected}
            >
              <InputLabel>Tag</InputLabel>
              <Select
                name="tagId"
                value={newCoupon.tagId}
                onChange={handleChange}
                label="Tag"
              >
                {tags
                  .filter(tag => !isCategorySelected || tag.categoryId === newCoupon.categoryId)
                  .map((val) => (
                    <MenuItem key={val._id} value={val._id}>
                      {val.tag}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>
                {isCategorySelected
                  ? "Choose relevant tags for the article."
                  : "Please select a category first to view available tags."
                }
              </FormHelperText>
            </FormControl>
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
              <span className="ml-2 text-sm font-medium text-gray-900">
                Status
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
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default News;