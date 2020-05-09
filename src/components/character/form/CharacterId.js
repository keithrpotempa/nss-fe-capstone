import React, { useEffect, useState } from "react";
import { Divider, Dropdown, Form, Label } from "semantic-ui-react";
import ApiManager from "../../../modules/ApiManager";
import TypeDetail from "../types/TypeDetail";

const CharacterId = props => {
  const character = props.character; 
  const setCharacterSubTypeDetails = props.setCharacterSubTypeDetails;
  const resetCharacter = props.resetCharacter;
  const characterInProgress = props.characterInProgress;
  const [characterTypeList, setCharacterTypeList] = useState([]);
  const [characterSubTypeList, setCharacterSubTypeList] = useState([]);

  const getCharacterTypeList = () => {
    return ApiManager.getAll("characterTypes")
      .then(setCharacterTypeList)
  }

  const getCharacterSubTypeList = () => {
    return ApiManager.getAll("characterSubTypes")
      .then(setCharacterSubTypeList)
  }

  // Once a character subtype is chosen, 
  // store all that subtype's details in state
  // on the parent component (mainform)
  // to be used by subsequent form components
  const getCharacterSubtypeDetails = subtypeId => {
    const subtype = characterSubTypeList
      .filter(subtype => subtype.id === subtypeId)[0]
    setCharacterSubTypeDetails(subtype);
  }

  const handleNameFieldChange = (evt, {name, value}) => {
    const stateToChange = {...character};
    stateToChange[name] = value;
    props.setCharacter(stateToChange)
  }

  const handleTypeFieldChange = (evt, {name, value}) => {
    const stateToChange = {...character};
    stateToChange[name] = value;
    // If they're a PC, set their subtype for them
    // (there's no subtype for PCs)
    // Otherwise, wipe any chosen subtype
    if (value === "0") {
      // TODO: make this less dependent on being hard-coded
      stateToChange["subtype"] = "5"; // 5 is the PC subtype
      // Force a get of the subtype details:
      getCharacterSubtypeDetails(5); 
    } else {
      // If they're changing the character's type, 
      // clear any chosen subtype info
      stateToChange["subtype"] = "";
      setCharacterSubTypeDetails({});
    }
    props.setCharacter(stateToChange)
  }

  const handleSubTypeFieldChange = (evt, {name, value}) => {
    if (characterInProgress()) {
      resetCharacter();
    }
    const stateToChange = {...character};
    stateToChange[name] = value;
    // Set subtype details in state
    getCharacterSubtypeDetails(parseInt(value))
    props.setCharacter(stateToChange)
  }

  useEffect(() => {
    getCharacterTypeList();
    getCharacterSubTypeList(); 
  }, [])

  return (
    <>
      <Divider horizontal><h2>ID</h2></Divider>
      <Form.Field>
        <label htmlFor="characterName">Name</label>
        <Form.Input 
          type="text"
          required
          onChange={handleNameFieldChange}
          className="character"
          name="name"
          id="name"
          placeholder="Character name"
          value={character.name}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown 
          required
          selection
          onChange={handleTypeFieldChange}
          className="type"
          name="type"
          id="type"
          placeholder="Character type"
          value={character.type}
          options={characterTypeList.map(type => (
            {
              key: `type-${type.id}`,
              value: `${type.id}`,
              text: `${type.name}`
            }
          ))}
        />
        {// Don't display this option until a type is chosen
          // And don't display it if they're a PC (no additional choice necessary)
          character.type === "" || character.type === "0"
            ? <></>
            : <Dropdown 
                required
                selection
                onChange={handleSubTypeFieldChange}
                className="subtype"
                name="subtype"
                id="subtype"
                placeholder="Character Subtype"
                value={character.subtype}
                options={characterSubTypeList
                  .filter(subtype => subtype.characterTypeId === parseInt(character.type))
                  .map(type => (
                  {
                    key: `type-${type.id}`,
                    value: `${type.id}`,
                    text: `${type.name}`
                  }
                ))}
              />
        }
      </Form.Field>
      {/* If they've already entered character information, 
        warn them about changing character subtype
        TODO: Make this a confirmation dialogue; that attempt was abandoned */}
      {characterInProgress() 
        ? <Label basic color="red" pointing>
            Changing character types or subtypes clears any character information already entered.
          </Label>
        : <></>
      }
      {
        character.subtype === ""
        ? <></>
        : <TypeDetail 
            verbose={false}
            subTypeId={parseInt(character.subtype)}
          />
      }
    </>
  )
}

export default CharacterId;