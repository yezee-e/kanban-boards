import moment from 'moment';
import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';

import styled from 'styled-components';

import { Draggable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { todoState } from '../atoms';

const nowTime = moment().format('YYYY-MM-DD');
const CardArea = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? '#a4bfea' : props.theme.cardColor};
  padding: 10px 30px;
  margin: 10px 0;
  font-size: 15px;
  height: 60px;
  border-radius: 20px;
`;
const CardInfo = styled.div`
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  font-size: 11px;
  margin-bottom: 5px;
`;
const CardEdit = styled.div`
  display: flex;
  gap: 10px;
`;
const Text = styled.div`
  font-weight: 500;
  font-size: 17px;
  margin-left: 10px;
`;

interface ICard {
  todoId: number;
  todoText: string;
  index: number;
  boardId: string;
}

function Card({ todoId, todoText, index, boardId }: ICard) {
  const [todos, setTodos] = useRecoilState(todoState);

  const onEdit = () => {
    const newToDoText = window
      .prompt(`${todoText} 할 일의 새 이름을 입력해주세요.`, todoText)
      ?.trim();
    if (newToDoText === '') {
      alert('내용을 작성해주세요.');
      return;
    }
    setTodos((allBoards) => {
      const boardCopy = [...allBoards[boardId]]; //어떤 보드위치
      const taskObj = boardCopy[index]; //몇번째카드
      const taskIndex = boardCopy.findIndex((board) => board.id === taskObj.id);
      const newTodo = {
        text: newToDoText as string,
        id: Date.now(),
      };
      boardCopy.splice(taskIndex, 1, newTodo);
      return {
        ...allBoards,
        [boardId]: boardCopy,
      };
    });
  };

  const onDelete = () => {
    if (window.confirm(`${todoText} 할 일을 삭제하시겠습니까?`)) {
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[boardId]]; //어떤 보드위치
        const taskObj = boardCopy[index]; //몇번째카드
        const taskIndex = boardCopy.findIndex(
          (board) => board.id === taskObj.id
        );
        boardCopy.splice(taskIndex, 1);
        return {
          ...allBoards,
          [boardId]: boardCopy,
        };
      });
    }
  };

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
            <CardEdit>
              <BsPencil onClick={onEdit} />

              <RiDeleteBinLine onClick={onDelete} />
            </CardEdit>
          </CardInfo>
          <Text>{todoText}</Text>
        </CardArea>
      )}
    </Draggable>
  );
}

export default React.memo(Card);
