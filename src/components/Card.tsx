import moment from 'moment';
import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { todoState } from '../atoms';
import { Draggable } from 'react-beautiful-dnd';

// const CardArea = styled.div`
//   border-radius: 5px;
//   padding: 10px 10px;
//   background-color: ${(props) => props.theme.cardColor};
//   margin-bottom: 5px;
// `;

const nowTime = moment().format('YYYY-MM-DD');
const CardArea = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? '#a4bfea' : props.theme.cardColor};
  padding: 10px 30px;
  margin: 10px 0;
  font-size: 15px;
  height: 60px;
`;
const CardInfo = styled.div``;

interface ICard {
  todoId: number;
  todoText: string;
  index: number;
}

function Card({ todoId, todoText, index }: ICard) {
  const onDelete = () => {};
  return (
    <Draggable key={todoId} draggableId={todoId + ''} index={index}>
      {(provided, snapshot) => (
        <CardArea
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <CardInfo>
            <div>{nowTime}</div>
            <div>
              <RiDeleteBinLine className='delete' onClick={() => onDelete()} />
            </div>
          </CardInfo>
          <div>{todoText}</div>
        </CardArea>
      )}
    </Draggable>
  );
}

export default React.memo(Card);
