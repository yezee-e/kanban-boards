import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';
import { ITodo } from '../atoms';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 30px;
  padding: 20px 10px;
  border-radius: 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  text-align: center;
  font-size: larger;
  font-weight: 700;
`;
const Drop = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#f4f8ff' : '#E8EBF0'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
`;

export interface IBoardProps {
  boardId: string;
  todos: ITodo[];
}

function Board({ boardId, todos }: IBoardProps) {
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Drop
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todos.map((todo, index) => (
              <Card
                key={todo.id}
                index={index}
                todoText={todo.text}
                todoId={todo.id}
              />
            ))}
            {provided.placeholder}
          </Drop>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
