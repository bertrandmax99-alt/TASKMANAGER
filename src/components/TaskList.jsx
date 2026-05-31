import { useState } from 'react'
import { Plus, Search, X, CheckSquare } from 'lucide-react'
import TaskItem from './TaskItem'

const VIEW_TITLES = {
  all: 'All Tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

const SORT_OPTIONS = [
  { value: 'dueDate',  label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title',    label: 'Title' },
  { value: 'created',  label: 'Created' },
]

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 }

export default function TaskList({
  tasks, projects, activeView, searchQuery, onSearchChange,
  selectedTaskId, onSelectTask, onToggleStatus, onAddTask, hasDetailPanel,
}) {
  const [sortBy, setSortBy] = useState('dueDate')
  const [filterPriority, setFilterPriority] = useState('all')

  const title = VIEW_TITLES[activeView] ?? projects.find(p => p.id === activeView)?.name ?? 'Tasks'
  const projectColor = !VIEW_TITLES[activeView] ? projects.find(p => p.id === activeView)?.color : null

  const sorted = [...tasks]
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === 'priority') return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
      return 0
    })

  return (
    <div className={`flex-1 flex flex-col overflow-hidden bg-white min-w-0 ${hasDetailPanel ? 'border-r border-gray-100' : ''}`}>
      {/* Header */}
      <div className="px-8 pt-7 pb-5 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {projectColor && (
              <span className="w-3 h-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: projectColor }} />
            )}
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-indigo-200/60"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add Task
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="text-sm border border-gray-200 bg-gray-50 text-gray-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
          >
            <option value="all">All priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 bg-gray-50 text-gray-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>Sort: {o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-light px-8 py-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <CheckSquare className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-sm">
              {searchQuery ? 'No matching tasks' : 'Nothing here yet'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {searchQuery ? 'Try a different search term' : 'Click "Add Task" to create your first task'}
            </p>
            {!searchQuery && (
              <button
                onClick={onAddTask}
                className="mt-4 flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                projects={projects}
                isSelected={selectedTaskId === task.id}
                onSelect={() => onSelectTask(task.id)}
                onToggleStatus={() => onToggleStatus(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
