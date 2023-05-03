import React, { useState } from 'react';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { GrUploadOption } from 'react-icons/gr';
import { MdLibraryAdd } from 'react-icons/md';
import { BsMicFill, BsFillMicMuteFill, BsFillSunFill } from 'react-icons/bs';
import { FaMoon } from 'react-icons/fa';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { isDarkAtom, todoState } from './atoms';
import Board from './components/Board';

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  margin: 20px 40px;
`;

const Logo = styled.div`
  font-size: 50px;
  font-weight: 700;
`;
const ToggleBtn = styled.button`
  background-color: inherit;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
`;
const Wrapper = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
`;
const Title = styled.div`
  display: flex;
  margin-top: 30px;
  gap: 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const Function = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    cursor: pointer;
    color: ${(props) => props.theme.textColor};
    font-size: 25px;
  }
`;

const Boards = styled.div`
  display: flex;
  width: 100vw;
  gap: 15px;
`;

const InputArea = styled.form`
  margin: 50px 0px;
  display: flex;
  justify-content: center;
  flex-direction: center;
  align-items: center;
  input {
    width: 40%;
    margin-right: 20px;
    border: 3px solid gray;
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
  position: relative;
  right: 130px;
  gap: 10px;
  align-items: center;
  button {
    background-color: inherit;
    border: none;
    font-size: 20px;
    margin-left: 20px;
    cursor: pointer;
    div {
      cursor: pointer;
    }
  }
`;

interface IForm {
  todo: string;
}

function KanbanBoard() {
  const [isDark, setIsDark] = useRecoilState(isDarkAtom);
  const [todos, setTodos] = useRecoilState(todoState);
  const [toggle, setToggle] = useState(false);
  const { register, handleSubmit, setValue, getValues } = useForm<IForm>();

  const toggleDarkAtom = () => {
    setIsDark((prev) => !prev);
  };

  const onSubmit = ({ todo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        할일: [newTodo, ...allBoards['할일']],
      };
    });
    setValue('todo', '');
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = 'ko-KR';
  recognition.onresult = function (e) {
    const record = e.results[0][0].transcript;
    let value = getValues('todo');
    value = record;
    setValue('todo', value);
  };
  if (!SpeechRecognition) {
    alert('현재 브라우저는 사용이 불가능합니다.');
  }
  if (SpeechRecognition) {
    if (toggle) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }

  const addBoard = () => {
    const name = window.prompt('새 보드의 이름을 입력해주세요.')?.trim();

    if (name !== null && name !== undefined) {
      if (name === '') {
        alert('이름을 입력해주세요.');
        return;
      }
      setTodos((allBoards) => {
        return {
          ...allBoards,
          [name]: [],
        };
      });
    }
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
    <Container>
      <Title>
        <Logo>kanban-board</Logo>

        <Function>
          <ToggleBtn onClick={toggleDarkAtom}>
            {isDark ? <FaMoon /> : <BsFillSunFill />}
          </ToggleBtn>
          <div onClick={addBoard}>
            <MdLibraryAdd />
          </div>
        </Function>
      </Title>
      <InputArea onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('todo', { required: 'Please wite a todo' })}
          type='text'
          placeholder='write a to do'
          autoComplete='off'
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(todos).map((boardId, index) => (
              <Board
                boardId={boardId}
                todos={todos[boardId]}
                key={boardId}
                boardIndex={index}
              />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </Container>
  );
}

export default KanbanBoard;
