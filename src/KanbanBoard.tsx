import React, { useState } from 'react';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { GrUploadOption } from 'react-icons/gr';
import { BsMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { ITodo, todoState } from './atoms';
import Board from './components/Board';

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 400px;
    height: 200px;
  }
`;
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const InputArea = styled.form`
  margin: 50px 0px;
  display: flex;
  justify-content: center;
  flex-direction: center;
  align-items: center;
  input {
    width: 50%;
    margin-right: 20px;
    border: none;
    border-bottom: 1px solid black;
    padding: 10px;
  }
  input:focus {
    outline: none;
  }

  input::placeholder {
    text-align: center;
  }
`;
const BtnIcon = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  button {
    background-color: inherit;
    border: none;
    font-size: 20px;
    margin-left: 20px;
  }
`;

interface IForm {
  todo: string;
}

function KanbanBoard() {
  const [todos, setTodos] = useRecoilState(todoState);
  const [toggle, setToggle] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onSubmit = ({ todo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        TO_DO: [newTodo, ...allBoards['TO_DO']],
      };
    });
    setValue('todo', '');
  };

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;
    //같은 보드에서의 움직임
    if (destination?.droppableId === source.droppableId) {
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index]; //객체형태
        boardCopy.splice(source.index, 1); // 잡은 아이템 위치에서 삭제
        boardCopy.splice(destination?.index, 0, taskObj); //새로운 위치에 넣기
        return {
          ...allBoards, //변화없는 보드 그대로 들고오기
          [source.droppableId]: boardCopy, //변경된 보드 넣기
        };
      });
    }
    //다른 보드에서의 움직임
    if (destination?.droppableId !== source.droppableId) {
      setTodos((allBoards) => {
        const startBoard = [...allBoards[source.droppableId]];
        const endBoard = [...allBoards[destination.droppableId]];
        const taskObj = startBoard[source.index]; //객체형태

        startBoard.splice(source.index, 1);
        endBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards, //변화없는 보드 그대로 들고오기
          [source.droppableId]: startBoard, //변경된 보드 넣기
          [destination.droppableId]: endBoard, //변경된 보드 넣기
        };
      });
    }
  };
  return (
    <>
      <Logo>
        <img src='pic/logo.png' alt='logo' />
      </Logo>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(todos).map((boardId) => (
              <Board boardId={boardId} todos={todos[boardId]} key={boardId} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>

      <InputArea onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('todo', { required: 'Please wite a todo' })}
          type='text'
          placeholder='write a to do'
        />
        <BtnIcon>
          <button>
            <GrUploadOption />
          </button>
          <div onClick={() => setToggle(!toggle)}>
            {toggle ? <BsMicFill /> : <BsFillMicMuteFill />}
          </div>
        </BtnIcon>
      </InputArea>
    </>
  );
}

export default KanbanBoard;
