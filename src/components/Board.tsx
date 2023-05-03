import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';
import { ITodo, todoState } from '../atoms';
import { useRecoilState } from 'recoil';
import { FaTrash } from 'react-icons/fa';

const Wrapper = styled.div<ISnapshotProps>`
  padding-top: 30px;
  padding: 20px 10px;
  border-radius: 20px;
  min-height: 300px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease-in-out;
  background-color: ${(props) =>
    props.isDraggingOver ? '#4169E1' : props.theme.boardColor};
`;
const BoardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    display: flex;
    gap: 5px;
  }
  button {
    background-color: inherit;
    border: none;
    color: #636161;
    cursor: pointer;
  }
`;
const Title = styled.div<ISnapshotProps>`
  text-align: center;
  font-size: 25px;
  font-weight: 600;
  margin-left: 20px;

  color: ${(props) => (props.isDraggingOver ? 'white' : props.theme.textColor)};
`;
interface ISnapshotProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Drop = styled.div`
  flex-grow: 1;
`;

export interface IBoardProps {
  boardId: string;
  todos: ITodo[];
  boardIndex: number;
}

function Board({ boardId, todos, boardIndex }: IBoardProps) {
  const [todo, setTodo] = useRecoilState(todoState);

  const deleteBoard = () => {
    if (window.confirm(`${boardId} 보드를 삭제하시겠습니까?`)) {
      setTodo((all) => {
        const copyAll = { ...all };
        Reflect.deleteProperty(copyAll, `${boardId}`);
        return copyAll;
      });
    }
  };

  return (
    <Droppable droppableId={boardId}>
      {(provided, snapshot) => (
        <Wrapper
          isDraggingOver={snapshot.isDraggingOver}
          isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
        >
          <BoardInfo>
            <Title
              isDraggingOver={snapshot.isDraggingOver}
              isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            >
              {boardId}
            </Title>

            <button onClick={deleteBoard}>
              <FaTrash />
            </button>
          </BoardInfo>

          <Drop {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Card
                key={todo.id}
                index={index}
                todoText={todo.text}
                todoId={todo.id}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
          </Drop>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Board;
