import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;

    // Search
    if (searchQuery) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Filter by Priority
    if (priorityFilter !== 'All') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const pMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, priorityFilter, sortBy, tasks]);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Operation failed', error);
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      fetchTasks();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500">Manage and organize your work</p>
        </div>
        <button 
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Task</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTasks.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Task</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Priority</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Due Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{task.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.priority === 'High' ? 'bg-red-50 text-red-600' :
                          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center space-x-1.5 ${
                          task.status === 'Completed' ? 'text-green-600' :
                          task.status === 'In Progress' ? 'text-purple-600' : 'text-yellow-600'
                        }`}>
                          <div className={`h-2 w-2 rounded-full ${
                             task.status === 'Completed' ? 'bg-green-600' :
                             task.status === 'In Progress' ? 'bg-purple-600' : 'bg-yellow-600'
                          }`}></div>
                          <span className="text-sm font-medium">{task.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link to={`/tasks/${task._id}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => { setTaskToDelete(task); setIsConfirmOpen(true); }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <div key={task._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' :
                      task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${
                      task.status === 'Completed' ? 'text-green-600' :
                      task.status === 'In Progress' ? 'text-purple-600' : 'text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                    <div className="flex space-x-1">
                      <Link to={`/tasks/${task._id}`} className="p-2 text-slate-400"><Eye className="h-4 w-4" /></Link>
                      <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-2 text-slate-400"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => { setTaskToDelete(task); setIsConfirmOpen(true); }} className="p-2 text-slate-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState 
            onAction={() => { setEditingTask(null); setIsModalOpen(true); }}
            actionLabel="Add your first task"
          />
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
      />
    </div>
  );
};

export default TaskList;
