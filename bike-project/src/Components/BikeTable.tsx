import Table from "react-bootstrap/esm/Table";
import data from "../bikes_response.json";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";
import { Form, Stack } from "react-bootstrap";

// Creating type aliases.
type Data = typeof data;
type SortKeys = keyof Data[0];
type SortOrder = "ascn" | "desc";

// This function handles the sorting logic.
function sortData({
  tableData,
  sortKey,
  reverse,
}: {
  tableData: Data;
  sortKey: SortKeys;
  reverse: boolean;
}) {
  if (!sortKey) return tableData; // Return unmanipulated data if there is no sorting.

  // Sorts a shallow copy of the bike_response data.
  const sortedData = [...tableData].sort((a, b) => {
    return a[sortKey] > b[sortKey] ? 1 : -1;
  });

  // reverses the sorted data
  if (reverse) {
    return sortedData.reverse();
  }

  return sortedData;
}

// Function for sorting columns by clicking the sort buttons - renders the button
// used for sorting the bike table.
function SortButton({
  sortOrder,
  columnKey,
  sortKey,
  onClick,
}: {
  sortOrder: SortOrder;
  columnKey: SortKeys;
  sortKey: SortKeys;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        sortKey === columnKey && sortOrder === "desc"
          ? "sort-button sort-reverse"
          : "sort-button"
      }`}
    >
      ▲
    </button>
  );
}

// This function renders the Bike table. It supports searching and sorting.
function biketable({ data }: { data: Data }) {
  // State Variables
  const [sortKey, setSortKey] = useState<SortKeys>("BikeID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascn");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Table Headers
  const bikeTableHeaders: { key: SortKeys; label: string }[] = [
    { key: "BikeID", label: "ID" },
    { key: "Make", label: "Make" },
    { key: "Model", label: "Model" },
    { key: "Year", label: "Year" },
    { key: "Displacement", label: "Displacement" },
    { key: "Price", label: "Price" },
    { key: "Terrain", label: "Terrain" },
    { key: "Description", label: "Description" },
  ];

  // Here the searchQuery state updates whenever the search input changes.
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchQuery(event.target.value);
  };

  // Here the filterQuery state is updated when the search button is clicked
  const handleSearchClick = () => {
    setFilterQuery(searchQuery);
  };

  // This filters the data array based on filterQuery.
  const filteredData = useCallback(() => {
    return data.filter((bike) =>
      Object.values(bike).some((value) =>
        String(value).toLowerCase().includes(filterQuery.toLowerCase())
      )
    );
  }, [data, filterQuery]);

  // This Sorts the filtered data based on sortKey and sortOrder, using the sortData function.
  const sortedData = useCallback(
    () =>
      sortData({
        tableData: filteredData(),
        sortKey,
        reverse: sortOrder === "desc",
      }),
    [filteredData, sortKey, sortOrder]
  );

  // This function toggles the sort order between ascending and descending
  function changeSort(key: SortKeys) {
    setSortOrder(sortOrder === "ascn" ? "desc" : "ascn");
    setSortKey(key);
  }

  return (
    <>
      <Stack gap={2}>
        <Form.Group className="mb-3">
          <Form.Label>Filter Table</Form.Label>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchClick} className="searchButton">
            Search
          </button>
        </Form.Group>

        <Table bordered hover variant="primary">
          <thead>
            <tr>
              {bikeTableHeaders?.map((column) => {
                return (
                  <td key={column.key}>
                    {column.label}{" "}
                    <SortButton
                      columnKey={column.key}
                      onClick={() => changeSort(column.key)}
                      {...{
                        sortOrder,
                        sortKey,
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sortedData().map((data: any) => {
              return (
                <tr key={data.BikeID}>
                  <td>{data.BikeID}</td>
                  <td>{data.Make}</td>
                  <td>{data.Model}</td>
                  <td>{data.Year}</td>
                  <td>{data.Displacement}</td>
                  <td>{data.Price}</td>
                  <td>{data.Terrain}</td>
                  <td>{data.Description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Stack>
    </>
  );
}

export default biketable;
