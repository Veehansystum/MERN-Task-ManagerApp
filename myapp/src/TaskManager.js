import React, { useEffect, useState } from 'react'
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { Toas, ToastContainer } from 'react-toastify';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';

function TaskManager() {
  const [input, setInput] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTask] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);


  const handalTask = () => {
    if (updateTask && input) {
      //update api call
      console.log('update api call');
      const obj = {
        taskName: input,
        isDone: updateTask.isDone,
        _id: updateTask._id
      }
      handldUpdateItem(obj);
    } else if (updateTask === null && input) {
      console.log('create api call');
      //create api call
      handleAddTask();
    }
    setInput('');
  }

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);
  const handleAddTask = async () => {
    const obj = {
      taskName: input,
      isDone: false
    }
    //console.log(obj);
    try {
      const { success, message } =
        await CreateTask(obj);
      if (success) {
        //show success toast
        notify(message, 'success');
      } else {
        //show error toast
        notify(message, 'error');
      }
  
      fetchAllTasks();
      //console.log(data);
    } catch (err) {
      console.error(err);
      notify('failed to create task', 'error');
    }

  }

  const fetchAllTasks = async () => {
    try {
      const response = await GetAllTasks();
      //console.log("Response:", response);
      console.log(response?.data);
      setAllTasks(response.data)
      setTasks(response.data);
      setCopyTask(response.data)

    } catch (err) {
      console.error(err);
      notify('failed to create task', 'error');
    }

  }

  useEffect(() => {
    fetchAllTasks()
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTaskById(id);
      if (success) {
        //show success toast
        notify(message, 'success');
      } else {
        //show error toast
        notify(message, 'error');
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify('failed to create task', 'error');
    }
  }

  const handleCheckAndUncheck = async (itam) => {
    const { _id, isDone, taskName } = itam;
    const obj = {
      taskName,
      isDone: !isDone
    }
    try {
      const updatedTask= await UpdateTaskById(_id,obj);
      //const { success, message } = await UpdateTaskById(_id, obj);
     setTasks(prev => prev.map(t=>t._id === _id ? updatedTask : t))
     notify('task updated successfully','success')
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      //notify('failed to create task', 'error');
      notify(err.message || 'failed to uapdate task' ,'error');
    }
  }

  const handldUpdateItem = async (itam) => {
    const { _id, isDone, taskName } = itam;
    const obj = {
      taskName,
      isDone: isDone
    }
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      if (success) {
        //show success toast
        notify(message, 'success');
      } else {
        //show error toast
        notify(message, 'error');
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify('failed to create task', 'error');
    }
  }

  const handleSearch=(e)=>{
   const terms =e.target.value.toLowerCase();
   const oldTasks =[...copyTasks];
   const results = oldTasks.filter((item)=>item.taskName.toLowerCase().includes(terms));
   setTasks(results);
  }

  return (
    <div>
      <div className='d-flex flex-column align-items-center w-50 m-auto mt-5'>
        <h1 className='mb-4'>Task Manger App</h1>
        {/* input and serch box */}
        <div className='d-flex justify-content-between align-items-center mb-4 w-100'>
          <div className='input-group flex-grow-1 me-2'>
            <input type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className=' form-control me-1'
              placeholder='Add a new task' />
            <button onClick={handalTask}  className='btn btn-success btn-sm me-2' type='button' >
              <FaPlus className='m-2' />
            </button>
          </div>
          <div className='input-group flex-grow-1 '>
            <span className='input-group-text'>
              <FaSearch className=' m-1' />
            </span>
            <input type="text" onChange={handleSearch} className='form-control'
              placeholder='Seacrch tasks'
            />
          </div>
        </div>
        {/* list of items */}
        <div className='d-flex flex-column w-100'>
          {
            tasks.map((itam, i) => (
              <div key={itam._id} className='m-2 p-2 border bg-light w-100 rounded-3 d-flex justify-content-between align-items-center'>
                <span className={itam.isDone ? 'text-decoration-line-through' : ""}>{itam.taskName}</span>
                <div>
                  <button type='button' onClick={() => handleCheckAndUncheck(itam)} className='btn btn-success btnbtn-sm me-2'>
                    <FaCheck className='' />
                  </button>
                  <button type='button' onClick={() => setUpdateTask(itam)} className='btn btn-primary btnbtn-sm me-2'>
                    <FaPencilAlt className='' />
                  </button>
                  <button type='button' onClick={() => handleDeleteTask(itam._id)} className='btn btn-danger btnbtn-sm me-2'>
                    <FaTrash className='' />
                  </button>

                </div>
              </div>
            ))
          }
        </div>
        {/* tostify  */}
        <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  )
}

export default TaskManager