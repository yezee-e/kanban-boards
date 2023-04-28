    <DragDropContext onDragEnd={onDragEnd}>
        <BoardArea>
          {todos.map((category) => (
            <Droppable key={category.title} droppableId={category.title}>
              {(provided) => (
                <Boarders {...provided.droppableProps} ref={provided.innerRef}>
                  <div>{category.title}</div>
                  <div>
                    {category.tasks.map((task, index) => (
                      <Draggable
                        key={task.title}
                        draggableId={task.title}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? '0.5' : '1',
                            }}
                          >
                            <Card task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                </Boarders>
              )}
            </Droppable>
          ))}
        </BoardArea>
      </DragDropContext>
