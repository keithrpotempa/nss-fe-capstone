import React, { useState, useEffect } from "react";
import { Container, Dropdown } from "semantic-ui-react";
import ApiManager from "../../../modules/ApiManager";
import TypeList from "./TypeList";

const Types = props => {
  const [typeList, setTypeList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [filteredSubTypes, setFilteredSubTypes] = useState([]);
  const [filter, setFilter] = useState("")

  const getTypeList = () => {
    return ApiManager.getAll("characterTypes")
      .then(types => types.sort((a,b) => a.name.localeCompare(b.name)))
      .then(setTypeList);
  }

  const getSubTypeList = () => {
    return ApiManager.getAll("characterSubTypes")
      .then(subtypes => subtypes.sort((a,b) => a.name.localeCompare(b.name)))
      .then(setSubTypeList);
  }

  const handleFilterChange = (evt, {name, value}) => {
    setFilter(value);
  }

  const filterSubTypes = () => {
    const subtypes = subTypeList
      .filter(subtype => subtype.characterTypeId === parseInt(filter))
    setFilteredSubTypes(subtypes);
  }

  useEffect(() => {
    getTypeList();
    getSubTypeList();
    if (filter !== "") {
      filterSubTypes();
    }
  }, [filter])

  return (
    <>
      <Container>
        <div className="header-container">
          <h1>Character Types</h1>
        </div>
        <div className="filter-div">
          <Dropdown
            clearable 
            selection
            onChange={handleFilterChange}
            className="type"
            name="type"
            id="type"
            placeholder="Filter by type"
            value={filter.type}
            options={typeList.map(type => (
              {
                key: `type-${type.id}`,
                value: `${type.id}`,
                text: `${type.name}`
              }
            ))}
          />
        </div>
        <TypeList 
          subTypeList={
            filter !== ""
              ? filteredSubTypes 
              : subTypeList
          }
          typeList={typeList}
        />
      </Container>
    </>
  )


}

export default Types