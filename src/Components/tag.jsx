import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Plus, Edit } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const BASE_URL = "http://192.168.29.225:5000" || "http://localhost:5000";

const Tag = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    categoryId: "",
    status: false,
  });
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tag/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (result?.Tags && result?.success) {
          setCoupons(result.Tags || []);
        } else if (result?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setMessage("No data found");
        };
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [navigate]);

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
          setCategories(result.Categorys || []);
        } else if (result?.status === 401) {
          setMessage("Your session has expired. Please log in again to continue.");
          navigate("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [navigate]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleOpen = () => {
    setNewCoupon({ code: "", categoryId: "", status: false });
    setEditingId(null);
    setIsChecked(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateCoupon = async () => {
    if (!newCoupon.code) {
      alert("Please enter a tag name.");
      return;
    }

    const payload = {
      tag: newCoupon.code,
      categoryId: newCoupon.categoryId,
      Status: isChecked ? "active" : "inactive",
      updatedAt: new Date().toISOString(),
    };

    try {
      const url = editingId
        ? `${BASE_URL}/tag/update?id=${editingId}`
        : `${BASE_URL}/tag/create`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (editingId) {
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon._id === editingId ? { ...coupon, ...payload } : coupon
          )
        );
      } else if (result?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");


      } else {
        // Add new tag with ID from backend or fallback id
        setCoupons((prev) => [
          ...prev,
          { ...payload, _id: result.id || `temp-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]);
      }

      handleClose();
    } catch (error) {
      console.error("Error in API call:", error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setNewCoupon({
      code: coupon.tag,
      categoryId: coupon.categoryId || "",
      status: coupon.Status === "active",
    });
    setIsChecked(coupon.Status === "active");
    setOpen(true);
  };

  const handleDeleteModalClose = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      const url = `${BASE_URL}/tag/delete?id=${selectedDeleteId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        }
      });

      if (response.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== selectedDeleteId));
        handleDeleteModalClose();
      } else if (response?.status === 401) {
        setMessage("Your session has expired. Please log in again to continue.");
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        alert("Failed to delete the item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting the item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {message && (
        <Alert severity="info" className="mb-4">
          {message}
        </Alert>
      )}

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-9 w-full mx-auto">
        <div className="flex justify-between items-center pb-7 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <h2 className="text-2xl font-semibold">Tags ({coupons.length})</h2>
          <div className="flex items-center flex-col sm:flex-row space-x-4 space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <TextField
              label="Search Tags..."
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
              Add New Tag
            </Button>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start">Sr. No</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Updated At</th>
                <th className="px-11 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon, index) => (
                <React.Fragment key={coupon._id}>
                  <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-400 border-gray-200">
                    <td className="px-6 py-4 text-start">{index + 1}</td>
                    <td className="px-6 py-4">{coupon.tag}</td>
                    <td className="px-6 py-4">{coupon.categoryId.category}</td>
                    <td className="px-6 py-4">{coupon.Status}</td>
                    <td className="px-6 py-4">
                      {coupon.createdAt
                        ? new Date(coupon.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.updatedAt
                        ? new Date(coupon.updatedAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="px-1 py-4 px-6 py-4 space-x-4">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:underline"
                        aria-label="Edit tag"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => toggleExpand(coupon._id)}
                        className="text-gray-600 hover:underline"
                        aria-label="View tag details"
                      >
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => confirmDelete(coupon._id)}
                        className="text-red-600"
                        aria-label="Delete tag"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>

                  {expandedId === coupon._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                          onClick={() => setExpandedId(null)}
                          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
                        >
                          ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Tag Details</h2>
                        <strong>Tag Name:</strong> {coupon.tag} <br />
                        <strong>Category Name:</strong> {coupon.categoryId.category} <br />
                        {/* <strong>Category ID:</strong> {coupon.categoryId || "N/A"} <br /> */}
                        <strong>Status:</strong> {coupon.Status} <br />
                        <strong>Created At:</strong>{" "}
                        {coupon.createdAt
                          ? new Date(coupon.createdAt).toLocaleDateString('en-GB')
                          : "N/A"}{" "}
                        <br />
                        <strong>Updated At:</strong>{" "}
                        {coupon.updatedAt
                          ? new Date(coupon.updatedAt).toLocaleDateString('en-GB')
                          : "N/A"}{" "}
                        <br />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? "Edit Tag" : "Add New Tag"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Tag Name"
              variant="outlined"
              fullWidth
              name="code"
              value={newCoupon.code}
              onChange={handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={newCoupon.categoryId}
                label="Category"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleToggle}
                  className="mr-2"
                />
                Status Active
              </label>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddOrUpdateCoupon} variant="contained">
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this tag?</DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteModalClose}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Tag;