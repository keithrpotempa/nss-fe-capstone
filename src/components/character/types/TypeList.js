import React, { useState, useEffect } from "react";
import Paginator from "react-hooks-paginator";
import { Card } from "semantic-ui-react";
import SubTypeCard from "./SubTypeCard";

/* 
  Child component of Types
  this receives a list of subtypes
  (filtered or not) and renders them with pagination
*/
const TypeList = props => {
  const subTypeList = props.subTypeList;
  const typeList = props.typeList;

  // State related to pagination 
  // reference: https://www.npmjs.com/package/react-hooks-paginator
  const pageLimit = 9;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    setCurrentData(subTypeList.slice(offset, offset + pageLimit))
  }, [offset, subTypeList])

  return (
    <>
      <Card.Group itemsPerRow={3}>
        {currentData.map(subType => 
            <SubTypeCard
              key={`subType-${subType.id}`}
              subType={subType}
              type={typeList.find(type => type.id === subType.characterTypeId)}
            />  
          )
        }
      </Card.Group>
      <Paginator 
          totalRecords={subTypeList.length}
          pageLimit={pageLimit}
          pageNeighbours={2}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
    </>
  )
}

export default TypeList