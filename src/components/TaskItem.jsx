import { CheckCircle2, Circle, ChevronRight, Calendar } from 'lucide-react'

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',  dot: 'bg-red-500' },
  high:   { label: 'High',   badge: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'Medium', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',  dot: 'bg-amber-500' },
  low:    { label: 'Low',    badge: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',   dot: 'bg-blue-400' },
}

function dateLabel(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((date - today) / 86400000)
  if (diff === 0)  return { text: 'Today',    cls: 'text-amber-600' }
  if (diff === 1)  return { text: 'Tomorrow', cls: 'text-amber-500' }
  if (diff < 0)    return { text: `${Math.abs(diff)}d overdue`, cls: 'text-red-600 font-semibold' }
  if (diff <= 6)   return { text: `${diff}d`,  cls: 'text-gray-400' }
  return {
    text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cls: 'text-gray-400',
  }
}

export default function TaskItem({ task, projects, isSelected, onSelect, onToggleStatus }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const project  = projects.find(p => p.id === task.projectId)
  const dl       = dateLabel(task.dueDate)
  const isDone   = task.status === 'done'

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'bg-indigo-50 border border-indigo-200 shadow-sm shadow-indigo-100'
          : isDone
            ? 'bg-gray-50/70 border border-gray-100 hover:bg-gray-100/60'
            : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm hover:shadow-gray-100'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onToggleStatus() }}
        className="flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
      >
        {isDone
          ? <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          : <Circle className={`w-5 h-5 transition-colors ${isSelected ? 'text-indigo-300' : 'text-gray-300 group-hover:text-gray-400'}`} />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug truncate mb-1 ${
          isDone ? 'line-through text-gray-400' : isSelected ? 'text-indigo-900' : 'text-gray-800'
        }`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full font-medium ${priority.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          {project && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
            </span>
          )}

          {dl && (
            <span className={`inline-flex items-center gap-1 text-[11px] ${dl.cls}`}>
              <Calendar className="w-3 h-3" />
              {dl.text}
            </span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-150 ${
        isSelected ? 'text-indigo-400 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'
      }`} />
    </div>
  )
}
