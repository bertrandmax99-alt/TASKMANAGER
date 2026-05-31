import { useState } from 'react'
import {
  CheckSquare, Calendar, Clock, CheckCircle2,
  Plus, Settings, LayoutDashboard, ChevronDown, ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'all', label: 'All Tasks', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'upcoming', label: 'Upcoming', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
]

const PALETTE = [
  '#6366f1', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#8b5cf6',
]

export default function Sidebar({ projects, tasks, activeView, onViewChange, onAddProject }) {
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#6366f1')
  const [showProjects, setShowProjects] = useState(true)

  const getCount = (viewId) => {
    const todayStr = new Date().toISOString().split('T')[0]
    switch (viewId) {
      case 'all':       return tasks.filter(t => t.status !== 'done').length
      case 'today':     return tasks.filter(t => t.dueDate === todayStr && t.status !== 'done').length
      case 'upcoming':  return tasks.filter(t => t.dueDate > todayStr && t.status !== 'done').length
      case 'completed': return tasks.filter(t => t.status === 'done').length
      default:          return tasks.filter(t => t.projectId === viewId && t.status !== 'done').length
    }
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return
    onAddProject(newProjectName.trim(), newProjectColor)
    setNewProjectName('')
    setNewProjectColor('#6366f1')
    setShowAddProject(false)
  }

  return (
    <div className="w-64 h-full bg-slate-950 flex flex-col flex-shrink-0 select-none">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/50">
            <CheckSquare className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-white text-[15px] tracking-tight">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-3 flex-1 overflow-y-auto scrollbar-thin">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const count = getCount(item.id)
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-100 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold tabular-nums ${
                    isActive ? 'bg-indigo-500/60 text-indigo-100' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Projects */}
        <div className="mt-6 mb-2">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
          >
            {showProjects
              ? <ChevronDown className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />}
            Projects
          </button>

          {showProjects && (
            <div className="mt-1 space-y-0.5">
              {projects.map(project => {
                const count = getCount(project.id)
                const isActive = activeView === project.id
                return (
                  <button
                    key={project.id}
                    onClick={() => onViewChange(project.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-100 group ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-black/10"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="flex-1 text-left font-medium truncate">{project.name}</span>
                    {count > 0 && (
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 tabular-nums">{count}</span>
                    )}
                  </button>
                )
              })}

              {!showAddProject ? (
                <button
                  onClick={() => setShowAddProject(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/70 transition-all duration-100"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              ) : (
                <form onSubmit={handleAddProject} className="px-3 py-2 space-y-2.5">
                  <input
                    autoFocus
                    type="text"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Escape' && setShowAddProject(false)}
                    placeholder="Project name…"
                    className="w-full bg-slate-800/80 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {PALETTE.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                          newProjectColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded-md hover:bg-indigo-500 transition-colors font-semibold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddProject(false); setNewProjectName('') }}
                      className="flex-1 bg-slate-800 text-slate-300 text-xs py-1.5 rounded-md hover:bg-slate-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800/60">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all duration-100">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
