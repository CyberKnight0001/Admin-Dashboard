import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const apiUrl =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleEdit = (id) => {
    setEditMode(id);
    setEditedName(users.find((user) => user.id === id).name);
  };

  const handleEditChange = (value) => {
    setEditedName(value);
  };

  const handleSave = (id) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, name: editedName };
      }
      return user;
    });
    setUsers(updatedUsers);
    setEditMode(null);
    setEditedName("");
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedName("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : filteredUsers.map((user) => user.id));
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="App">
      <header>
        <input
          type="text"
          placeholder="HireQuotient Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr
                key={user.id}
                className={selectedRows.includes(user.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelect(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>
                  {editMode === user.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => handleEditChange(e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {editMode === user.id ? (
                    <>
                      <button
                        className="save"
                        onClick={() => handleSave(user.id)}
                      >
                        Save
                      </button>
                      <button className="cancel" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit"
                        onClick={() => handleEdit(user.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer>
        <div className="pagination">
          <button className="first-page" onClick={() => handlePageChange(1)}>
            First
          </button>
          <button
            className="previous-page"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={currentPage === page + 1 ? "active" : ""}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
          <button
            className="last-page"
            onClick={() => handlePageChange(totalPages)}
          >
            Last
          </button>
        </div>
        <button className="delete-selected" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      </footer>
    </div>
  );
}

export default App;
