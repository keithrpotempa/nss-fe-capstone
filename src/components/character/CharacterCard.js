import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Icon, Label } from "semantic-ui-react"
import "./Character.css";

const CharacterCard = props => {
  const character = props.character;
  const activeUser = props.activeUser;
  const user = props.character.user;

  return (
    <>
      <Card 
        raised
        // href={`/characters/${character.id}`}
        header={character.name}
        // description={props.highConcept}
        meta={`by: ${user.email}`}
        extra={
          <>
            {/* A label detailing what character subtype they are  */}
            <Label
              tag
              color="blue"
              size="tiny"
              content={props.character.characterSubType.name}
            />
            {/* Conditionally rendering these buttons 
            if the user created this character */}
            {activeUser && activeUser.id === user.id
            ? <div className="flex-end">
                <Link to={`/characters/${character.id}`}>
                  <Button 
                    className="ui button"
                  >
                    <Icon fitted className="file outline"/>
                  </Button>
                </Link>  
                <Button className="ui button"
                    onClick={props.handleDelete}
                  >
                  <Icon fitted className="trash alternate outline"/>
                </Button>
                <Link to={`/characters/${character.id}/edit`}>
                  <Button 
                    className="ui button"
                  >
                    <Icon fitted className="edit outline"/>
                  </Button>
                </Link>
              </div>
            : <div className="flex-end">
              <Link to={`/characters/${character.id}`}>
                <Button 
                  className="ui button"
                >
                  <Icon fitted className="file outline"/>
                </Button>
              </Link>  
            </div>
            }
          </>
        }
      />

    </>
  )
}

export default CharacterCard