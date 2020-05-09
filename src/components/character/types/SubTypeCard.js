import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon } from "semantic-ui-react";

const SubTypeCard = props => {
  const subType = props.subType;
  // TODO: Keeps this from erroring out if it takes to long to get the props:
  const type = props.type !== undefined ? props.type.name : ""

  return (
    <>
      <Card
        raised
        header={subType.name}
        description={subType.purpose}
        meta={`Associated Type: ${type}`}
        // The following safely open a new tab
        extra={
          <div className="flex-end">
            <Link to={`/types/${subType.id}`}>
              <Button 
                className="ui button"
              >
                <Icon fitted className="file outline"/>
              </Button>
            </Link>  
          </div>
        }
      />
    </>
  )
}

export default SubTypeCard;