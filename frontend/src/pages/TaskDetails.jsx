import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Edit2, 
  Trash2,
  Tag
} from 'lucide-react';
import { taskService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchTask = async () => {
    try {
      const response = await taskService.getTask(id);
      setTask(response.data);
    } catch (error) {
      console.error('Failed to fetch task', error);
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      fetchTask();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await taskService.deleteTask(id);
      navigate('/tasks');
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!task) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Link 
        to="/tasks" 
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Tasks</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  task.priority === 'High' ? 'bg-red-100 text-red-600' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {task.priority} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-600' :
                  task.status === 'In Progress' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {task.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">{task.title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary-600 rounded-2xl transition-all"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsConfirmOpen(true)}
                className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Due Date</p>
                <p className="text-slate-900 font-semibold">{new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Created On</p>
                <p className="text-slate-900 font-semibold">{new Date(task.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Tag className="h-5 w-5 text-slate-400" />
              <span>Description</span>
            </h3>
            <div className="text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[150px]">
              {task.description || "No description provided for this task."}
            </div>
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateTask}
        task={task}
        title="Edit Task"
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to permanentely delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskDetails;
