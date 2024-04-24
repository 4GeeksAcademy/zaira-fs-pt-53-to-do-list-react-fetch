import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const makeRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const user = 'zaira'; // Usuario específico

const getUserUrl = () => `https://playground.4geeks.com/apis/fake/todos/user/${user}`;

const createUser = async () => {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify([]),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        await fetch(getUserUrl(), requestOptions);
    } catch (error) {
        console.error("Error creating the user: ", error);
    }
}


const ToDoList = () => {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [taskCount, setTaskCount] = useState(0);

    const validate = (value) => {
        if (value.trim() !== '') {
            setNewTask(value);
        } else {
            alert('The input is not valid');
        }
    }

    const addTask = () => {
        if (newTask.trim() !== '') {
            const newTaskObject = {
                id: makeRandomId(10),
                label: newTask,
                done: false
            };

            setTasks([...tasks, newTaskObject]);
            setTaskCount((prevCount) => prevCount + 1);
            updateTasks([...tasks, newTaskObject]);
            setNewTask('');
        } else {
            alert('Please enter a valid input');
        }
    }

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id); 
        setTasks(updatedTasks);
        setTaskCount((prevCount) => prevCount - 1);
        updateTasks(updatedTasks);
    };

    const getTasks = async () => {
        try {
            const response = await fetch(getUserUrl(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const tasks = await response.json();
                setTasks(tasks);
                setTaskCount(tasks.length);
            } else if (response.status === 404) {
                createUser();
                setTasks([]);
                setTaskCount(0);
            } else {
                console.error("Error loading tasks: ", response.statusText);
            }
        } catch (error) {
            console.error("Error loading tasks: ", error);
        }
    }

    const updateTasks = async (updatedTasks) => {
        try {
            await fetch(getUserUrl(), {
                method: 'PUT',
                body: JSON.stringify(updatedTasks),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.ok);
        } catch (error) {
            console.error("Error updating tasks: ", error);
        }
    };

    const onDeleteAll = async () => {
        try {
            await fetch(getUserUrl(), {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    alert('User euphoria achieved! Clearing the slate... because who needs a to-do list when life is a mess anyway? 🚮✨');
                    setTasks([]); // Clear tasks after successful deletion
                    setTaskCount(0); // Reset task count
                }
            });
        } catch (error) {
            console.log("Error while trying to delete everything", error);
        }
    }

    useEffect(() => {
        createUser(); 
        getTasks();
    }, []); 

    useEffect(() => {
        if (tasks.length !== 0) {
            updateTasks(tasks);
        }
    }, [tasks]);
  
	return (
	  <div className="todo-app stack">
		<>
		<p className="list-title">To Do List</p> 
		<input
			type="text"
			placeholder="Add a task..."
			value={newTask}
			onChange={(e) => setNewTask(e.target.value)}
			onKeyDown={(e) => e.key === 'Enter' && addTask()}
		/>
	
		 <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.label}
            <span className="delete-icon" onClick={() => deleteTask(task.id)}>
              &#10006;
            </span>
          </li>
        ))}
      </ul>
		<p className="pending-complete">{taskCount} tasks to complete</p>
		<button onClick={onDeleteAll}>Clear All Tasks</button> 
		</>
	  </div>
	);
  }
  
  ReactDOM.render(<ToDoList />, document.querySelector("#app"));


export default ToDoList;
