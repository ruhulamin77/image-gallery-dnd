import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { AiFillCheckSquare } from 'react-icons/ai';
import { BsImage } from 'react-icons/bs';

function App() {
  const [items, setItems] = useState([
    { id: '1', image: '/assets/images/image-1.webp' },
    {
      id: '2',
      image: '/assets/images/image-2.webp',
    },
    {
      id: '3',
      image: '/assets/images/image-3.webp',
    },
    {
      id: '4',
      image: '/assets/images/image-4.webp',
    },
    {
      id: '5',
      image: '/assets/images/image-5.webp',
    },
    {
      id: '6',
      image: '/assets/images/image-6.webp',
    },
    {
      id: '7',
      image: '/assets/images/image-7.webp',
    },
    // {
    //   id: '8',
    //   image: '/assets/images/image-8.webp',
    // },
    // {
    //   id: '9',
    //   image: '/assets/images/image-9.webp',
    // },
  ]);

  console.log(items);

  const [selectedItems, setSelectedItems] = useState([]);

  // delete handler
  const deleteSelectedItems = () => {
    const remainingItems = items.filter(
      (item) => !selectedItems.includes(item.id)
    );
    setItems(remainingItems);
    setSelectedItems([]);
  };

  // select and unselect handler
  const changeHandler = (id) => {
    const updatedSelectedItems = [...selectedItems];
    if (updatedSelectedItems.includes(id)) {
      // If the item is already selected, remove it
      const index = updatedSelectedItems.indexOf(id);
      if (index !== -1) {
        updatedSelectedItems.splice(index, 1);
      }
    } else {
      // If the item is not selected, add it
      updatedSelectedItems.push(id);
    }
    setSelectedItems(updatedSelectedItems);
  };

  // handle drag and drop events
  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const reorderedItems = [...items];
    const [reorderedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, reorderedItem);
    setItems(reorderedItems);
  };

  const handleImageUpload = ({ target: { files } }) => {
    const file = files[0];

    // check if a file is selected and if it is an image
    if (file && file.type.startsWith('image/')) {
      setItems((prevImages) => [
        ...prevImages,
        {
          id: items.length + 1, // generate a unique ID for the image
          image: URL.createObjectURL(file),
          isSelected: false,
        },
      ]);
    } else {
      // handle invalid file type or no file selected
      alert('Invalid file type or no file selected!');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div id="select">
        <div className="selected_count">
          <>
            {selectedItems.length < 1 ? (
              'Gallery'
            ) : (
              <>
                <AiFillCheckSquare />{' '}
                {selectedItems.length > 0 && selectedItems.length}
                {selectedItems.length == 1 ? ' File' : ' Files'} Selected
              </>
            )}
          </>
        </div>
        <div>
          {selectedItems.length > 0 && (
            <div className="delete_container" onClick={deleteSelectedItems}>
              <button className="delete_btn">Delete</button>{' '}
              <span>{selectedItems.length == 1 ? 'File' : 'Files'}</span>
            </div>
          )}
        </div>
      </div>

      <Droppable droppableId="gallery" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`container ${
              snapshot.isDraggingOver ? 'drag-over' : ''
            }`}
          >
            {items.map((item, index) => (
              <Draggable
                draggableId={item.id.toString()}
                key={item.id}
                index={index}
              >
                {(provided) => {
                  const itemStyle = {
                    ...provided.draggableProps.style,
                  };
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={itemStyle}
                      className={index === 0 ? 'item item-1' : 'item'}
                    >
                      <img src={item.image} alt="" />
                      <div className="overlay">
                        <input
                          type="checkbox"
                          id={`checkbox${item.id}`}
                          onChange={() => changeHandler(item.id)}
                        />
                      </div>
                    </div>
                  );
                }}
              </Draggable>
            ))}
            <div className="add_image item">
              <label htmlFor="add_img">
                {' '}
                <BsImage /> Add Image
              </label>
              <input id="add_img" type="file" onChange={handleImageUpload} />
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
