import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import TaskDetail from './components/TaskDetail'
import TaskModal from './components/TaskModal'

const INITIAL_PROJECTS = [
  { id: 'p1', name: 'Work', color: '#6366f1' },
  { id: 'p2', name: 'Personal', color: '#10b981' },
  { id: 'p3', name: 'Health', color: '#f59e0b' },
  { id: 'p4', name: 'Learning', color: '#ec4899' },
]

const d = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

const INITIAL_TASKS = [
  { id: 't1', title: 'Review Q3 performance report', description: 'Analyze quarterly metrics and prepare an executive summary for the board meeting.', priority: 'high', status: 'todo', dueDate: d(0), projectId: 'p1', tags: ['review', 'report'], createdAt: new Date().toISOString() },
  { id: 't2', title: 'Schedule team sync meeting', description: 'Set up a recurring slot for the engineering team standup.', priority: 'medium', status: 'todo', dueDate: d(0), projectId: 'p1', tags: ['meeting'], createdAt: new Date().toISOString() },
  { id: 't3', title: 'Update project roadmap', description: 'Revise Q4 milestones based on current sprint velocity and stakeholder feedback.', priority: 'urgent', status: 'in-progress', dueDate: d(1), projectId: 'p1', tags: ['planning'], createdAt: new Date().toISOString() },
  { id: 't4', title: 'Code review for PR #142', description: 'Review the authentication refactor changes and leave detailed comments.', priority: 'high', status: 'todo', dueDate: d(0), projectId: 'p1', tags: ['code-review'], createdAt: new Date().toISOString() },
  { id: 't5', title: 'Prepare product launch slides', description: 'Create a compelling presentation for next week\'s launch event.', priority: 'high', status: 'todo', dueDate: d(6), projectId: 'p1', tags: ['presentation'], createdAt: new Date().toISOString() },
  { id: 't6', title: 'Buy groceries', description: 'Milk, eggs, bread, vegetables, chicken breast, olive oil.', priority: 'medium', status: 'todo', dueDate: d(0), projectId: 'p2', tags: [], createdAt: new Date().toISOString() },
  { id: 't7', title: 'Book flight for conference', description: 'Look for direct flights, budget under $400.', priority: 'medium', status: 'todo', dueDate: d(3), projectId: 'p2', tags: ['travel'], createdAt: new Date().toISOString() },
  { id: 't8', title: 'Call dentist for appointment', description: 'Overdue for a cleaning — schedule for next week.', priority: 'medium', status: 'todo', dueDate: d(2), projectId: 'p3', tags: ['health'], createdAt: new Date().toISOString() },
  { id: 't9', title: 'Morning workout', description: '30 min cardio followed by strength training.', priority: 'medium', status: 'done', dueDate: d(0), projectId: 'p3', tags: ['fitness'], createdAt: new Date().toISOString() },
  { id: 't10', title: 'Finish React hooks module', description: 'Complete sections on useReducer, useContext, and custom hooks.', priority: 'medium', status: 'in-progress', dueDate: d(5), projectId: 'p4', tags: ['react', 'frontend'], createdAt: new Date().toISOString() },
  { id: 't11', title: 'Read "Atomic Habits" ch. 5–7', description: '', priority: 'low', status: 'todo', dueDate: d(7), projectId: 'p4', tags: ['reading'], createdAt: new Date().toISOString() },
  { id: 't12', title: 'Set up home office desk', description: 'Assemble new standing desk and cable-manage the monitor setup.', priority: 'low', status: 'done', dueDate: d(-1), projectId: 'p2', tags: [], createdAt: new Date().toISOString() },
]

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tf_tasks')
      return saved ? JSON.parse(saved) : INITIAL_TASKS
    } catch {
      return INITIAL_TASKS
    }
  })
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('tf_projects')
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS
    } catch {
      return INITIAL_PROJECTS
    }
  })
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [activeView, setActiveView] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('tf_projects', JSON.stringify(projects))
  }, [projects])

  const addTask = (taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      ...taskData,
      status: 'todo',
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
    setSelectedTaskId(newTask.id)
  }

  const updateTask = (id, updates) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    )
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (selectedTaskId === id) setSelectedTaskId(null)
  }

  const toggleTaskStatus = (id) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const newStatus = t.status === 'done' ? 'todo' : 'done'
        return { ...t, status: newStatus, updatedAt: new Date().toISOString() }
      })
    )
  }

  const addProject = (name, color) => {
    const newProject = { id: `p${Date.now()}`, name, color }
    setProjects(prev => [...prev, newProject])
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      )
    }

    const todayStr = d(0)

    switch (activeView) {
      case 'today':
        return filtered.filter(t => t.dueDate === todayStr && t.status !== 'done')
      case 'upcoming':
        return filtered.filter(t => t.dueDate > todayStr && t.status !== 'done')
      case 'completed':
        return filtered.filter(t => t.status === 'done')
      case 'all':
        return filtered.filter(t => t.status !== 'done')
      default:
        return filtered.filter(t => t.projectId === activeView && t.status !== 'done')
    }
  }

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null

  const handleViewChange = (view) => {
    setActiveView(view)
    setSelectedTaskId(null)
    setSearchQuery('')
  }

  const handleSelectTask = (id) => {
    setSelectedTaskId(prev => prev === id ? null : id)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar
        projects={projects}
        tasks={tasks}
        activeView={activeView}
        onViewChange={handleViewChange}
        onAddProject={addProject}
      />
      <TaskList
        tasks={getFilteredTasks()}
        projects={projects}
        activeView={activeView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTaskId={selectedTaskId}
        onSelectTask={handleSelectTask}
        onToggleStatus={toggleTaskStatus}
        onAddTask={() => setShowModal(true)}
        hasDetailPanel={!!selectedTask}
      />
      {selectedTask && (
        <TaskDetail
          key={selectedTask.id}
          task={selectedTask}
          projects={projects}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
      {showModal && (
        <TaskModal
          projects={projects}
          activeView={activeView}
          onAdd={(data) => {
            addTask(data)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default App
