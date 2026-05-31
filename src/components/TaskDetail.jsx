import { useState } from 'react'
import { X, Trash2, Circle, CheckCircle2, AlertCircle } from 'lucide-react'

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent', active: 'bg-red-100 text-red-700 ring-1 ring-red-200',    idle: 'text-gray-400 hover:bg-gray-100' },
  { value: 'high',   label: 'High',   active: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200', idle: 'text-gray-400 hover:bg-gray-100' },
  { value: 'medium', label: 'Medium', active: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',  idle: 'text-gray-400 hover:bg-gray-100' },
  { value: 'low',    label: 'Low',    active: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',   idle: 'text-gray-400 hover:bg-gray-100' },
]

const STATUS_OPTIONS = [
  { value: 'todo',        label: 'To Do',       Icon: Circle,       active: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200' },
  { value: 'in-progress', label: 'In Progress',  Icon: AlertCircle,  active: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' },
  { value: 'done',        label: 'Done',         Icon: CheckCircle2, active: 'bg-green-100 text-green-700 ring-1 ring-green-200' },
]

function Field({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-20 pt-0.5 flex-shrink-0 uppercase tracking-wide">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function TaskDetail({ task, projects, onUpdate, onDelete, onClose }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(false)

  const saveTitle = () => {
    const t = title.trim()
    if (t && t !== task.title) onUpdate(task.id, { title: t })
    else setTitle(task.title)
    setIsEditingTitle(false)
  }

  const saveDescription = () => {
    if (description !== task.description) onUpdate(task.id, { description })
  }

  const formattedDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="w-96 h-full bg-gray-50/80 border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-5 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <span className="text-sm font-semibold text-gray-600">Task Details</span>
        <div className="flex items-center gap-1">
          {pendingDelete ? (
            <div className="flex items-center gap-2 mr-1">
              <span className="text-xs text-red-600 font-semibold">Delete task?</span>
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded font-semibold transition-colors"
              >Yes</button>
              <button
                onClick={() => setPendingDelete(false)}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setPendingDelete(true)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-light">
        {/* Title */}
        <div className="px-5 py-4 bg-white border-b border-gray-100">
          {isEditingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => {
                if (e.key === 'Enter') saveTitle()
                if (e.key === 'Escape') { setTitle(task.title); setIsEditingTitle(false) }
              }}
              className="w-full text-base font-bold text-gray-900 bg-transparent border-0 outline-none focus:outline-none leading-snug"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className={`text-base font-bold leading-snug cursor-text hover:text-indigo-700 transition-colors ${
                task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
              title="Click to edit"
            >
              {task.title}
            </h2>
          )}
        </div>

        {/* Properties */}
        <div className="px-5 py-2 bg-white border-b border-gray-100">
          {/* Status */}
          <Field label="Status">
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => onUpdate(task.id, { status: value })}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    task.status === value
                      ? STATUS_OPTIONS.find(s => s.value === value)?.active
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Priority */}
          <Field label="Priority">
            <div className="flex flex-wrap gap-1">
              {PRIORITY_OPTIONS.map(p => (
                <button
                  key={p.value}
                  onClick={() => onUpdate(task.id, { priority: p.value })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    task.priority === p.value ? p.active : p.idle
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Due Date */}
          <Field label="Due Date">
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={e => onUpdate(task.id, { dueDate: e.target.value })}
              className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all cursor-pointer"
            />
          </Field>

          {/* Project */}
          <Field label="Project">
            <select
              value={task.projectId || ''}
              onChange={e => onUpdate(task.id, { projectId: e.target.value })}
              className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer w-full max-w-[200px]"
            >
              <option value="">No project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Description */}
        <div className="px-5 py-4 bg-white border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={saveDescription}
            placeholder="Add notes or description…"
            rows={5}
            className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none placeholder-gray-400 leading-relaxed transition-all"
          />
        </div>

        {/* Metadata */}
        <div className="px-5 py-4 space-y-1">
          <p className="text-[11px] text-gray-400">
            Created {formattedDate(task.createdAt)}
          </p>
          {task.updatedAt && (
            <p className="text-[11px] text-gray-400">
              Updated {formattedDate(task.updatedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
