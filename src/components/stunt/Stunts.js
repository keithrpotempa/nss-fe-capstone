import React, { useState, useEffect } from "react";
import { Container, Dropdown } from "semantic-ui-react"
import ApiManager from "../../modules/ApiManager";
import StuntList from "./StuntList"

// This is a parent component of StuntList
// it retrieves the stunts, handles filters
// and passes them down to StuntList to render
const Stunts = props => {
  const [stunts, setStunts] = useState([]);
  const [filteredStunts, setFilteredStunts] = useState([]);
  const [filter, setFilter] = useState("");

  const [skills, setSkills] = useState([]);

  const getStunts = () => {
    ApiManager.getAll("stunts")
      .then(stunts => stunts.sort((a,b) => a.name.localeCompare(b.name)))
      .then(setStunts)
  }

  const getSkills = () => {
    return ApiManager.getAll("skills")
      .then(skills => skills.sort((a, b) => a.name.localeCompare(b.name)))
      .then(setSkills)
  }  

  const handleFilterChange = (evt, {name, value}) => {
    setFilter(value);
  }

  const filterStunts = () => {
    const stuntList = stunts
      .filter(stunt => stunt.skillId === parseInt(filter))
    setFilteredStunts(stuntList)
  }

  useEffect(() => {
    getSkills();
    getStunts();
    if (filter !== "") {
      filterStunts();
    }
  }, [filter])

  return (
    <>
      <Container>
        <div className="header-container">
          <h1>Stunts</h1>
        </div>
        <div className="filter-div">
          <Dropdown
            clearable 
            selection
            onChange={handleFilterChange}
            className="skill"
            name="skill"
            id="skill"
            placeholder="Filter by skill"
            value={filter}
            // Getting the index out of map
            options={skills.map((skill, index) => (
              {
                key: `skills-${Object.keys(skills)[index]}`,
                value: `${Object.keys(skills)[index]}`,
                text: `${skill.name}`
              }
            ))}
          />
        </div>
        <StuntList
          key="stuntlist" 
          stunts={ 
            filter !== ""
              ? filteredStunts
              : stunts
          } 
          skills={skills}
        />
      </Container>
    </>
  )
}

export default Stunts