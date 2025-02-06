import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Tasks({ searchTerm  , darkMode}) {
  const [getAllTask, setAllTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState ({ title: "", description: "", dueDate: "" });
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  function handleEdit(task) {
    setEditingTask({ ...task });
  }


  async function handleUpdateTask() {


    const data = await axios.put(`https://jsonplaceholder.typicode.com/todos/${editingTask.id}`, {
      title: editingTask.title,
      description: editingTask.description,
      dueDate: editingTask.dueDate,
    });




    toast.success( "task added succesfully");
    setAllTask((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id ? { ...editingTask } : task
      )
    );
    
   
    setEditingTask(null);
  }

  async function handleAddTask() {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/todos", newTask);
      setAllTask((prevTasks) => [...prevTasks, { ...newTask, id: response.data.id }]);
      console.log(response);
      setNewTask({ title: "", description: "", dueDate: "", completed: false });
      setShowAddTask(false);
      toast.success( "task added succesfully");
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  }

  async function getTasks() {
    try {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');

      const tasksWithDetails = data.map((task) => ({
        ...task,
        description: `Description for ${task.title}`,
        dueDate: new Date().toLocaleDateString(),
      }));

      console.log(tasksWithDetails.filter((task) => task.completed === false));
      setAllTask(tasksWithDetails);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function toggleTaskStatus(taskId, currentStatus) {
    try {
      const updatedStatus = !currentStatus;
      const data = await axios.put(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        completed: updatedStatus,
      });

      console.log(data.data.completed);

      setAllTask((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: updatedStatus } : task
        )
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  function handleFilter(filter) {
    setSelectedFilter(filter);
  }

  function displayTask() {
    let filteredTasks = getAllTask;

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (selectedFilter) {
      case 'com':
        return filteredTasks.filter((task) => task.completed);
      case 'pen':
        return filteredTasks.filter((task) => !task.completed);
      case 'all':
      default:
        return filteredTasks;
    }
  }

  async function removeTask(taskId) {
    try {
      const data = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
      console.log(data);
      setEditingTask(null);
      setAllTask((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success( "task removed succesfully");

    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div className="container ">
            <div className='row d-flex align-items-baseline '>

        <div className="d-flex mb-3 align-items-baseline col-md-6  justify-content-center">
          <div
            className={`clickable filter-box m-2 ${selectedFilter === 'all' ? 'active-filter' : ''}`}
            onClick={() => handleFilter('all')}
          >
            <h4 className="filter-title m-1">All</h4>
          </div>

          <div
            className={`clickable filter-box d-flex align-items-baseline ${
              selectedFilter === 'com' ? 'active-filter' : ''
            }`}
            onClick={() => handleFilter('com')}
          >
            <span className="status-circle bg-success m-2"></span>
            <h4 className="filter-title">Completed</h4>
          </div>

          <div
            className={`clickable filter-box d-flex align-items-baseline ${
              selectedFilter === 'pen' ? 'active-filter' : ''
            }`}
            onClick={() => handleFilter('pen')}
          >
            <span className="status-circle bg-warning m-2"></span>
            <h4 className="filter-title">Pending</h4>
          </div>
        </div>


        <div className='col-md-6 d-flex     justify-content-center'>
          <button className="btn btn-info rounded-pill  mb-2" onClick={() => setShowAddTask(true)}>
            + Add New Task
          </button>
        </div>


        </div>
      </div>

      <div className="m-2">
        {showAddTask && (
          <div className="container mt-3">
            <input
              type="text"
              placeholder="Task Title"
              className="form-control mb-2"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />

            <input
              type="text"
              placeholder="Description"
              className="form-control mb-2"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            <input
              type="date"
              className="form-control mb-2"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />

            <button className="btn btn-success me-2" onClick={handleAddTask}>
              Save Task
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAddTask(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="container">
        <div className="row g-3">
          {displayTask()?.map(function (task, idx) {
            return (
              <div key={idx} className="col-md-4">
                <div className="bg-light text-center p-4 rounded-3 shadow position-relative">
                  <div className="position-absolute top-0 end-0 me-2 mt-2 d-flex align-items-baseline">
                    <i
                      className={`fas fa-pen mx-2 clickable ${darkMode ? "text-light" : "text-dark"}`}
                      style={{ cursor: "pointer", fontSize: "0.9rem" }}
                      onClick={() => handleEdit(task)}
                    ></i>
                    <button
                      className="btn btn-danger d-flex align-items-center justify-content-center"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        border: "none",
                        padding: "0",
                        display: "flex",
                      }}
                      onClick={() => removeTask(task.id)}
                    >
                      <i className="fas fa-times text-white" style={{ fontSize: "0.7rem" }}></i>
                    </button>
                  </div>

                  {editingTask?.id === task.id ? (
                    <>
                          <div className=' mb-2 mt-2'>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="form-control mb-2"
                      />

                      <input
                        type="text"
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="form-control mb-2"
                      />

                      <input
                        type="text"
                        value={editingTask.dueDate}
                        onChange={(e) =>
                          setEditingTask((prev) => ({ ...prev, dueDate: e.target.value }))
                        }
                        className="form-control"
                      />

                        </div>
                    </>
                  ) : (
                    <>
                      <h6 className="fw-bold">{task.title}</h6>
                      <p>{task.description}</p>
                      <p>
                        <strong>Due Date:</strong> {task.dueDate}
                      </p>
                    </>
                  )}

                  <div className="d-flex justify-content-center align-items-baseline">
                    <span
                      className={`status-circle ${task.completed ? 'bg-success' : 'bg-warning'}`}
                    ></span>
                    <h6 className="ms-2">{task.completed ? 'Completed' : 'Pending'}</h6>
                  </div>
                  <div>
                    <p>
                      <span className="fw-bold">Asssigned to</span> {task.userId}
                    </p>
                  </div>
                  <button
                    className={`btn ${task.completed ? 'btn-warning' : 'btn-success'} mt-2`}
                    onClick={() => toggleTaskStatus(task.id, task.completed)}  disabled={editingTask} 
                  >
                    {task.completed ? 'Mark as Not Completed' : 'Mark as Completed'}
                  </button>

                  {editingTask?.id === task.id && (
                    <div className="mt-2">
                      <button className="btn btn-success btn-sm me-2" onClick={handleUpdateTask}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingTask(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}