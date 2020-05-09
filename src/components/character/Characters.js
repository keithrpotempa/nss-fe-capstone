import React, { useState, useEffect } from "react";
import { Button, Icon, Container, Dropdown } from "semantic-ui-react"
import CharacterList from "./CharacterList"
import ApiManager from "../../modules/ApiManager";

/* 
  Parent component of CharacterList
  it retrieves all the characters, puts them in state
  handles the type and subtype filters, and passes
  a filtered list of characters to CharacterList
*/
const Characters = props => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  /* State related to the filter dropdowns */ 
  const [characterTypes, setCharacterTypes] = useState([]);
  const [characterSubTypes, setCharacterSubTypes] = useState([]);
  const [filter, setFilter] = useState({type: "", subtype: ""})

  const getCharacters = () => {
    return ApiManager.getCharacterList("characters")
        /* Sorting characters alphabetically
          https://stackoverflow.com/a/45544166*/
      .then(characters => characters.sort((a,b) => a.name.localeCompare(b.name)))
      .then(setCharacters)
  }

  // const getCharacters = () => {
  //   ApiManager.getCharacterList()
  //       /* Sorting characters alphabetically
  //         https://stackoverflow.com/a/45544166*/
  //     .then(characters => characters.sort((a,b) => a.name.localeCompare(b.name)))
  //     .then(setCharacters)
  // }

  const getCharacterTypeList = () => {
    return ApiManager.getAll("characterTypes")
      .then(setCharacterTypes)
  }

  const getCharacterSubTypeList = () => {
    return ApiManager.getAll("characterSubTypes")
      .then(setCharacterSubTypes)
  }

  const handleFilterFieldChange = (evt, {name, value}) => {
    const stateToChange = {...filter};
    stateToChange[name] = value;
    // If they're a PC, set their subtype for them
    // (there's no subtype for PCs)
    // Otherwise, wipe any chosen subtype
    if (name === "type") {
      if (value === "1") {
        stateToChange["subtype"] = "6";
        // If they're changing the character's type, 
        // clear any chosen subtype info
      }
      else {
        stateToChange["subtype"] = "";
      }
    }
    setFilter(stateToChange);
  }

  const renderSubtypes = () => {
    let subtypes = characterSubTypes
      .sort((a,b) => a.name.localeCompare(b.name))
    if (filter.type !== "") {
      subtypes = subtypes
        .filter(subtype => subtype.characterTypeId === parseInt(filter.type))
    }
    return subtypes.map(type => (
      {
        key: `type-${type.id}`,
        value: `${type.id}`,
        text: `${type.name}`
      }
    ))
  }

  const filterCharacters = () => {
    let characterList = characters;
    if (filter.type !== "") {
      characterList = characterList
        .filter(character => character.characterSubType.characterTypeId === parseInt(filter.type))
    }
    if (filter.subtype !== "") {
      characterList = characterList
        .filter(character => character.characterSubTypeId === parseInt(filter.subtype))
    }
    setFilteredCharacters(characterList);
  }

  useEffect(() => {
    getCharacters();
    getCharacterTypeList();
    getCharacterSubTypeList();
    if (filter.type !== "" || filter.subtype !== "") {
      filterCharacters();
    }
  }, [filter])

  return (
    <>
      <Container>
        <div className="filter-div">
          <Button
            type="button"
            onClick={() => {props.history.push("/characters/new")}}
          >
            <Icon className="add user"></Icon>
          </Button>
          <Dropdown
            clearable 
            selection
            onChange={handleFilterFieldChange}
            className="type"
            name="type"
            id="type"
            placeholder="Filter by type"
            value={filter.type}
            options={characterTypes.map(type => (
              {
                key: `type-${type.id}`,
                value: `${type.id}`,
                text: `${type.name}`
              }
            ))}
          />
          <Dropdown 
            clearable
            selection
            onChange={handleFilterFieldChange}
            className="subtype"
            name="subtype"
            id="subtype"
            placeholder="Character Subtype"
            value={filter.subtype}
            options={renderSubtypes()}
          />
        </div>
        <CharacterList 
          characters={
            filter.type !== "" || filter.subtype !== ""
              ? filteredCharacters
              : characters
          }
          getCharacters={getCharacters}
        />
      </Container>
    </>
  )
}

export default Characters