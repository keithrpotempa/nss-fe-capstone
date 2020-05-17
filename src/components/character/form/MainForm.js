import React, { useState, useEffect } from "react";
import { Button, Container, Divider, Grid } from "semantic-ui-react";
import { confirmAlert } from 'react-confirm-alert';
import "../Character.css";
import AspectForm from "./AspectsForm";
import SkillsForm from "./SkillsForm";
import StuntsForm from "./StuntsForm";
import SaveCharacter from "./SaveCharacter";
import SheetReview from "./SheetReview";
import CharacterId from "./CharacterId";
import { Menu } from 'semantic-ui-react'
import EditCharacter from "./EditCharacter";

const MainForm = props => {
  /* ------------------ STATES ------------------*/
  const skillList = props.skillList;
  const stuntList = props.stuntList;

  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);


  const [character, setCharacter] = useState({name: "", type: "", subtype: ""});
  const [characterSubTypeDetails, setCharacterSubTypeDetails] = useState();

  // Seeding a default array of aspects
  // presently with their types (currently) hard coded
  const [characterAspects, setCharacterAspects] = useState([
    { name: "", aspectTypeId: 1 },
    { name: "", aspectTypeId: 2 },
    { name: "", aspectTypeId: 3 },    
    { name: "", aspectTypeId: 3 },
    { name: "", aspectTypeId: 3 },
    { name: "", aspectTypeId: 3 }
  ])

  const [characterSkills, setCharacterSkills] = useState({
    6: [],
    5: [],
    4: [],
    3: [],
    2: [],
    1: []
  });

  const [characterStunts, setCharacterStunts] = useState({
    5: "",
    4: "",
    3: "",
    2: "",
    1: ""
  });

  // TODO: utilize useReducer instead
  // https://reactjs.org/docs/hooks-reference.html#usereducer
  const resetCharacter = () => {
    setCharacterAspects([
      { name: "", aspectTypeId: 1 },
      { name: "", aspectTypeId: 2 },
      { name: "", aspectTypeId: 3 },    
      { name: "", aspectTypeId: 3 },
      { name: "", aspectTypeId: 3 },
      { name: "", aspectTypeId: 3 }
    ]);
    setCharacterSkills({
      6: [],
      5: [],
      4: [],
      3: [],
      2: [],
      1: []
    });
    setCharacterStunts({
      5: "",
      4: "",
      3: "",
      2: "",
      1: ""
    })
  }

  /* ------------------ EVENT HANDLERS  ------------------*/

  const handleItemClick = (evt, {index}) => {
    if (validStep()) {
      setStep(index);
    }
  }

  const handleButtonClick = (evt, {value}) => {
    // User cannot move forward unless the current fields
    // are valid. But they can move backwards.
    if (value === "next") {
      if (validStep()) {
        setStep(step+1)
      }
    } else if (value === "previous") {
      setStep(step-1)
    }
  }

  /* ------------------ VALIDATIONS  ------------------*/
  // TODO: these are duplicated here and in SaveCharacter

  const characterInProgress = () => {
    if (characterAspects[0].name !== "" 
        || characterSkills[1].length > 0
        || characterStunts[1] !== ""
    ) {
    return true
    } else {
      return false
    }
  }

  const validationConfirm = (message) => {
    confirmAlert({
      title: 'Required Field',
      message: message,
      buttons: [
        {
          label: 'Ok',
          onClick: null
        }
      ]
    });
  }

  const validStep = () => {
    switch(step) {
      default:
      case 1:
        if (character.name === "") {
          validationConfirm("Enter a character name")
          return false
        } else if (character.subtype === "") {
          validationConfirm("Enter a character type & subtype")
          return false
        } else {
          return true
        }
      case 2: 
        if (characterAspects[0].name === "") {
          validationConfirm("Enter a High Concept aspect")
          return false
        } else {
          return true
        }
      case 3: 
        if (skillsAreEmpty()) {
          validationConfirm("Choose at least one skill")
          return false
        } else if (duplicateSkills().length > 0) {
          validationConfirm("You cannot have any duplicate skills")
          return false
        } else {
          return true
        }
      case 4: 
        if (duplicateStunts().length > 0) {
          validationConfirm("You cannot have any duplicate stunts")
          return false
        } else {
          return true
        }
    }
  }

  const skillsAreEmpty = () => {
    const skillLevels = Object.values(characterSkills)
    const nonEmptySkillLevels = skillLevels.filter(skillLevel => skillLevel.length !== 0)
    if (nonEmptySkillLevels.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const duplicateSkills = () => {
    const skillLevels = Object.values(characterSkills)
    const nonEmptySkillLevels = skillLevels.filter(skillLevel => skillLevel.length !== 0)
    // Flatteing using the ES6 spread operator:
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    const allSkills = [].concat(...nonEmptySkillLevels);
    // Finding duplicates in an array:
    // https://stackoverflow.com/a/840808
    const sortedSkills = allSkills.slice().sort();
    let duplicates = [];
    for (let i = 0; i < sortedSkills.length - 1; i++) {
      if (sortedSkills[i+1] === sortedSkills[i]) {
        duplicates.push(sortedSkills[i]);
      }
    }
    return duplicates;
  }

  const duplicateStunts = () => {
    const stuntRows = Object.values(characterStunts)
    const nonEmptyStuntRows = stuntRows.filter(stuntRow => stuntRow.length !== 0)
    // Flatteing using the ES6 spread operator:
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    const allStunts = [].concat(...nonEmptyStuntRows);
    // Finding duplicates in an array:
    // https://stackoverflow.com/a/840808
    const sortedStunts = allStunts.slice().sort();
    let duplicates = [];
    for (let i = 0; i < sortedStunts.length - 1; i++) {
      if (sortedStunts[i+1] === sortedStunts[i]) {
        duplicates.push(sortedStunts[i]);
      }
    }
    return duplicates;
  }

  /* ------------------ RENDERING  ------------------*/
  // Helpful links:
  // https://www.digitalocean.com/community/tutorials/how-to-create-multistep-forms-with-react-and-semantic-ui
  const renderStep = () => {
    switch(step){
      default: 
      case 1:
        return <CharacterId 
          character={character} 
          setCharacter={setCharacter}
          setCharacterSubTypeDetails={setCharacterSubTypeDetails}
          characterInProgress={characterInProgress}
          resetCharacter={resetCharacter}
        />
      case 2: 
        return <AspectForm
          type={characterSubTypeDetails.name}
          aspects={characterAspects}
          setAspects={setCharacterAspects}
          maxAspects={characterSubTypeDetails.maxAspects}
          aspectComment={characterSubTypeDetails.aspectComment}
        />
      case 3: 
        return <SkillsForm 
          skillList={skillList}
          characterSkills={characterSkills}
          setCharacterSkills={setCharacterSkills}
          maxSkillRating={characterSubTypeDetails.maxSkillRating}
          skillRatingComment={characterSubTypeDetails.skillRatingComment}
          skillChoiceComment={characterSubTypeDetails.skillChoiceComment}
          type={characterSubTypeDetails.name}
        />
      case 4: 
        return <StuntsForm
          characterStunts={characterStunts}
          setCharacterStunts={setCharacterStunts}
          skillList={skillList}
          stuntList={stuntList}
          type={characterSubTypeDetails.name}
          maxStunts={characterSubTypeDetails.maxStunts}
          stuntComment={characterSubTypeDetails.stuntComment}
        />
      case 5:
        return <>
            <Divider horizontal><h1>Review and Save</h1></Divider>
            <SheetReview
              character={character}
              aspects={characterAspects}
              skills={characterSkills}
              stunts={characterStunts}
              skillList={skillList}
              stuntList={stuntList}
              characterSubType={characterSubTypeDetails}
            />
        </>
    }
  }

  useEffect(() => {
    setIsLoading(false);
  }, [])

  return (
    <>
      <Container>
        {/* If this is an edit, render the component that 
          retrieves all the characters' data */}
        {props.match.params.characterId
          ? <EditCharacter 
            characterId={props.match.params.characterId}
            setCharacter={setCharacter}
            characterAspects={characterAspects}
            setCharacterAspects={setCharacterAspects}
            characterSkills={characterSkills}
            setCharacterSkills={setCharacterSkills}
            characterStunts={characterStunts}
            setCharacterStunts={setCharacterStunts}
            setIsLoading={setIsLoading}
            setCharacterSubTypeDetails={setCharacterSubTypeDetails}
          />
          : <></>
        }
        <Grid columns={2}>
          <Grid.Column width={3}>
            <Menu inverted pointing compact vertical 
              size="large" 
              color="blue"
            >
              <Menu.Item
                name='details'
                index={1}
                active={step === 1}
                onClick={handleItemClick}
              />
              <Menu.Item
                name='aspects'
                index={2}
                active={step === 2}
                onClick={handleItemClick}
              />
              <Menu.Item
                name='skills'
                index={3}
                active={step === 3}
                onClick={handleItemClick}
              />
              <Menu.Item
                name='stunts'
                index={4}
                active={step === 4}
                onClick={handleItemClick}
              />
              <Menu.Item
                name='review'
                index={5}
                active={step === 5}
                onClick={handleItemClick}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Divider horizontal>
              <h1>CHARACTER FORM</h1>
            </Divider>
            {/* Renders the form for whatever step we're on */}
            {renderStep()}
            <div className="flex-end">
              {/* Don't render a "previous button on step 1 */}
              {step !== 1
                ? <Button
                    type="button"
                    value="previous"
                    // disabled={isLoading}
                    onClick={handleButtonClick}
                  >
                    Previous
                  </Button>
                : <></>
              }
              {/* If it's the last step, change the button to "submit" */}
              {step !== 5
                ? <Button
                    type="button"
                    value="next"
                    // disabled={isLoading}
                    onClick={handleButtonClick}
                  >
                  Next
                </Button>
                : <SaveCharacter
                    character={character}
                    aspects={characterAspects}
                    skills={characterSkills}
                    stunts={characterStunts}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    {...props}
                  />
              }
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  )
}

export default MainForm;