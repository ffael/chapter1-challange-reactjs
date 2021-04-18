import { useState, useEffect } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    setError(false)
  }, [newTaskTitle])

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (newTaskTitle === '') {
      return setError(true)
    }

    const duplicateTitle = tasks.find((task) => task.title === newTaskTitle)

    if (duplicateTitle) {
      const confirm = window.confirm('Ja existe uma tarefa com esse titulo, deseja criar uma nova tarefa com o mesmo titulo?')

      if (!confirm) {
        return
      }
    }
    setTasks([...tasks, {
      id: Math.floor(Math.random() * 100),
      title: newTaskTitle,
      isComplete: false
    }])
    setNewTaskTitle('')
    setError(false)
  }



  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    let found = tasks.find((task) => task.id === id)
    if (found) {
      found.isComplete = !found.isComplete
      setTasks([...tasks])
    }
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID
    let remainder = tasks.filter((task) => task.id !== id)
    if (remainder) {
      setTasks([...remainder])
    }
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          {error && <strong style={{ color: 'red', fontSize: '12px', userSelect: 'none' }}>A tarefa precisa de um titúlo!</strong>}
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>

        </div>
      </header>

      <main>
        {tasks.length === 0 && <h3 style={{ width: '100%', textAlign: 'center', color: '#ccc', userSelect: 'none' }}>Nenhuma Tarefa Adicionada!</h3>}
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section>
  )
}