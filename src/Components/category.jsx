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


// const BASE_URL =  process.env.BACKEND_URL || "https://admin.techspherebulletin.com";
const BASE_URL = 'http://192.168.29.225:5000' || "http://localhost:5000";
const Category = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    category: "",
    contain: "",
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

  useEffect(() => {
    const handleAddOrUpdateCoupon = async () => {
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
          setCoupons(result.Categorys);
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
    setNewCoupon({ category: "", contain: "", status: false });
    setEditingId(null);
    setIsChecked(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setNewCoupon({ ...newCoupon, [name]: files[0] }); // Store the file object
    } else {
      setNewCoupon({ ...newCoupon, [name]: value });
    }
  };

  const handleAddOrUpdateCoupon = async () => {
    if (!newCoupon.category || !newCoupon.contain) {
      alert("Please enter Category name and content.");
      return;
    }

    const formData = new FormData();
    formData.append("category", newCoupon.category);
    formData.append("categoryContent", newCoupon.contain);
    formData.append("Status", isChecked ? "active" : "inactive");

    // Append images (Make sure they are properly stored as File objects)
    if (newCoupon?.image) formData.append("image", newCoupon.image);

    try {
      const url = editingId
        ? `${BASE_URL}/category/update?id=${editingId}`
        : `${BASE_URL}/category/create`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          "Authorization": localStorage.getItem("token"),
        }
      });

      const result = await response.json();
      if (result) {
      } else if (result?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      };
      handleClose();
    } catch (error) {
      console.error("Error in API call:", error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setNewCoupon({
      image: coupon.image,
      category: coupon.category,
      contain: coupon.categoryContent,
      freeDelivery: coupon.Status,
    });
    setIsChecked(coupon.Status === "active" ? true : false);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      // First check if category has associated tags
      const checkTagsResponse = await fetch(`${BASE_URL}/tag/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
      });

      const tagsData = await checkTagsResponse.json();
      const hasTags = tagsData.Tags.some(
        (tag) => tag.categoryId === selectedDeleteId
      );
      if (hasTags) {
        if (hasTags) {
          alert(
            "Cannot delete this category because it has associated tags. Please delete or reassign the tags first."
          );
          handleDeleteModalClose();
          return;
        }
      } else if (tagsData?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      };

      // If no tags are associated, proceed with deletion
      const url = `${BASE_URL}/category/delete?id=${selectedDeleteId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        },
      });

      const result = await response.json();

      if (response.ok) {
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon._id !== selectedDeleteId)
        );
        handleDeleteModalClose();
      } else if (result?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setMessage("Failed to delete the category. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCoupons = coupons?.filter((coupon) =>
    coupon.category?.toLowerCase().includes(searchTerm?.toLowerCase())
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
          <h2 className="text-2xl font-semibold">Category ({coupons.length})</h2>
          <div className="flex items-center flex-col sm:flex-row space-x-4 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <TextField
              label="Search Categorys... &nbsp;&nbsp;&nbsp;&nbsp; &#128269;"
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
              Add New Category
            </Button>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start">Sr. No</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Content</th>
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
                    <td className="px-6 py-4">{coupon.category}</td>
                    <td className="px-6 py-4">{coupon.categoryContent}</td>
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
                        <strong>Category Name:</strong> {coupon.category} <br />
                        <strong>Category Content:</strong>{" "}
                        {coupon.categoryContent} <br />
                        {coupon.image && (
                          <>
                            <strong>Image:</strong> <br />
                            <img
                              src={`${BASE_URL}/${coupon.image}`} // Adjust the path as per your API
                              alt={coupon.category}
                              className="w-96 h-80 object-contain  rounded-md mt-2"
                            />
                          </>
                        )}
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
                Are you sure you want to delete this category? This action cannot
                be undone.
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
          <DialogTitle>
            {editingId ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogContent className="grid gap-4">
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={newCoupon.category}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Category Contain"
              name="contain"
              value={newCoupon.contain}
              onChange={handleChange}
              margin="dense"
            />
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

export default Category;