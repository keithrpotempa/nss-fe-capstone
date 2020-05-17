import React, { useState, useEffect } from "react";
import { Container, Dropdown } from "semantic-ui-react";
import TypeList from "./TypeList";

/*
  This is a parent component of the type list,
  ~~it retrieves the stunts,~~ handles filters
  and passes them down to the list to render
*/
const Types = props => {
  const typeList = props.characterTypeList;
  const subTypeList = props.characterSubTypeList;
  const [filteredSubTypes, setFilteredSubTypes] = useState([]);
  const [filter, setFilter] = useState("")

  const handleFilterChange = (evt, {name, value}) => {
    setFilter(value);
  }

  const filterSubTypes = () => {
    const subtypes = subTypeList
      .filter(subtype => subtype.characterTypeId === parseInt(filter))
    setFilteredSubTypes(subtypes);
  }

  useEffect(() => {
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