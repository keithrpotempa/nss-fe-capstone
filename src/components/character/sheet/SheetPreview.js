import React from "react";
import { Divider, Grid, Label, Segment } from "semantic-ui-react"

import StressConsequences from "./StressConsequences";
import CharacterAspects from "./CharacterAspects";
import CharacterSkills from "./CharacterSkills";
import CharacterStunts from "./CharacterStunts";

const SheetPreview = props => {
  // This component renders a Character Sheet for:
  // the character sheet (character detail view)
  // Review; last stage of creating / editing a character

  return (
    <>
      <Divider horizontal>
        <h4>ID</h4>
      </Divider>
      {/* <div className="flex-space-between"> */}
        <p><strong>Name:</strong> {props.character.name}</p>
        <Label
          tag
          color="blue"
          content={props.characterSubType.name}
        />
      {/* </div> */}
      <Segment basic placeholder>
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
            <CharacterAspects aspects={props.aspects}/>
          </Grid.Column>
          <Grid.Column verticalAlign='middle'>
            {/* <CharacterSkills skills={props.skills}/> */}
          </Grid.Column>
        </Grid>
      </Segment>
      {/* <CharacterStunts stunts={props.stunts}/> */}
      {/* <StressConsequences
        physiqueRating={props.physiqueRating}
        willRating={props.willRating}
        characterSubType={props.characterSubType}
      /> */}
    </>
  )
}

export default SheetPreview;