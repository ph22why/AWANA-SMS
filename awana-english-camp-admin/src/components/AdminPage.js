import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "./AdminPage.css";
import backendHost from "../config";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("students");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    const params = {
      search,
      page,
    };

    if (limit !== 'all') {
      params.limit = limit;
    }

    axios
      .get(`${backendHost}:8080/admin/${type}`, {
        params,
      })
      .then((response) => {
        console.log("Fetched data:", response.data); // 콘솔에 데이터 출력
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [type, search, limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleDelete = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      axios
        .delete(`${backendHost}:8080/admin/${type}/${id}`)
        .then(() => {
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditData(item);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = () => {
    axios
      .put(`${backendHost}:8080/admin/${type}/${editItem.id}`, editData)
      .then(() => {
        setEditItem(null);
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleLimitChange = (e) => {
    const newLimit = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1);
  };

  const handleAssignGroups = async () => {
    try {
      const response = await axios.post(`${backendHost}:8080/admin/assign-groups`);
      alert(response.data.message);
    } catch (error) {
      console.error("Error assigning groups:", error);
      alert("Error assigning groups. Please try again.");
    }
  };

  const handleRankAssignment = async () => {
    try {
      const response = await axios.put(`${backendHost}:8080/score/all-rank`);
      alert(response.data.message);
      fetchData(); // 데이터 갱신
    } catch (error) {
      console.error("Error assigning ranks:", error);
      alert("Error assigning ranks. Please try again.");
    }
  };

  const getColumns = () => {
    switch (type) {
      case "students":
        return [
          { displayName: "ID", key: "id" },
          { displayName: "한글이름", key: "koreanName" },
          { displayName: "영어이름", key: "englishName" },
          { displayName: "교회명", key: "churchName" },
          { displayName: "교회등록번호", key: "churchNumber" },
          { displayName: "부모연락처", key: "parentContact" },
          { displayName: "특이사항", key: "healthNotes" },
          { displayName: "옷사이즈", key: "shirtSize" },
          { displayName: "성별", key: "gender" },
          { displayName: "그룹", key: "studentGroup" },
          { displayName: "조", key: "team" }
        ];
      case "ym":
        return [
          { displayName: "ID", key: "id" },
          { displayName: "이름", key: "name" },
          { displayName: "교회등록번호", key: "churchNumber" },
          { displayName: "교회명", key: "churchName" },
          { displayName: "성별", key: "gender" },
          { displayName: "클럽", key: "awanaRole" },
          { displayName: "학년", key: "position" },
          { displayName: "연락처", key: "contact" },
          { displayName: "옷사이즈", key: "shirtSize" },
        ];
      case "staff":
        return [
          { displayName: "ID", key: "id" },
          { displayName: "이름", key: "name" },
          { displayName: "교회등록번호", key: "churchNumber" },
          { displayName: "교회명", key: "churchName" },
          { displayName: "성별", key: "gender" },
          { displayName: "어와나 역할", key: "awanaRole" },
          { displayName: "직분", key: "position" },
          { displayName: "연락처", key: "contact" },
          { displayName: "옷사이즈", key: "shirtSize" },
        ];
      case "scores":
        return [
          { displayName: "ID", key: "id" },
          { displayName: "학생 ID", key: "student_id" },
          { displayName: "질문 1", key: "question1" },
          { displayName: "질문 2", key: "question2" },
          { displayName: "질문 3", key: "question3" },
          { displayName: "질문 4", key: "question4" },
          { displayName: "질문 5", key: "question5" },
          { displayName: "질문 6", key: "question6" },
          { displayName: "질문 7", key: "question7" },
          { displayName: "질문 8", key: "question8" },
          { displayName: "질문 9", key: "question9" },
          { displayName: "총점", key: "total" },
          { displayName: "등급", key: "rank" },
        ];
      default:
        return [];
    }
  };

  const renderTableHeader = () => {
    const columns = getColumns();
    return (
      <tr>
        {columns.map((column) => (
          <th key={column.key}>{column.displayName}</th>
        ))}
        <th>Actions</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    const columns = getColumns();
    console.log("Data for rows:", data); // 데이터가 올바르게 매핑되는지 확인
    return data.map((item) => (
      <tr key={item.id}>
        {columns.map((column) => (
          <td key={column.key}>{item[column.key]}</td>
        ))}
        <td>
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${type}_data.xlsx`);
  };

  return (
    <div className="admin-page">
      <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
        Admin Page
      </h1>
      <div className="controls">
        <select onChange={handleTypeChange} value={type}>
          <option value="students">Students</option>
          <option value="ym">YM</option>
          <option value="staff">Staff</option>
          <option value="attendance">Attendance</option>
          <option value="scores">Scores</option> {/* Scores 옵션 추가 */}
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleDownloadExcel}>Download Excel</button>
        <button onClick={handleAssignGroups}>Assign Groups</button> {/* 그룹 배정 버튼 추가 */}
        <button onClick={handleRankAssignment}>Assign Ranks</button> {/* 랭크 부여 버튼 추가 */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => handlePageChange(page + 1)}>Next</button>
          <select onChange={handleLimitChange} value={limit}>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </div>
      </div>
      <table>
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      {editItem && (
        <div className="modal">
          <h2>Edit {type}</h2>
          {getColumns().map((column) => (
            <div key={column.key}>
              <label>{column.displayName}</label>
              <input
                name={column.key}
                value={editData[column.key] || ""}
                onChange={handleEditChange}
              />
            </div>
          ))}
          <button onClick={() => setEditItem(null)}>Cancel</button>
          <button onClick={handleEditSubmit}>Save</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
