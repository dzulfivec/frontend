import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../styles/button.css";
import "../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import DropdownSearch from "../component/dropdown";
import { GoArrowUpRight } from "react-icons/go";
import axios from "axios";
import Swal from "sweetalert2";
import { GoArrowRight } from "react-icons/go";
import { LuArrowRight } from "react-icons/lu";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const DataTable = ({
  columns = [],
  data = [],
  actions = [],
  keyField = "id",
  onSearch,
  searchValue = "",
  onPageChange,
  currentPage = 1,
  pageSize = 10,
}) => {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="rounded-xl shadow-md bg-white p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          className="border p-2 rounded-md w-64"
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-lg">
          <thead>
            <tr className="bg-indigo-600 text-white rounded-lg">
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-left">
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item[keyField]}
                className="border-t hover:bg-gray-50 border-indigo-500"
              >
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.render
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="p-3 flex gap-2">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        className={`px-5 py-2 text-sm rounded-md ${
                          typeof action.variant === "function"
                            ? action.variant(item)
                            : action.variant ||
                              "bg-indigo-500 text-indigo-50 font-semibold transition-all border-2 border-transparent hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-600"
                        }`}
                        onClick={() => action.onClick(item)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-start mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`h-10 w-10 rounded-lg border ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "border-indigo-500"
              }`}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataTable;
