import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingScreen from '../components/LoadingScreen';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    highPriority: tasks.filter(t => t.priority === 'High').length,
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your productivity</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ClipboardList} color="blue" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={stats.inProgress} icon={ArrowRight} color="purple" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green" />
        <StatCard title="High Priority" value={stats.highPriority} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {tasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {tasks.slice(0, 5).map((task) => (
                  <Link 
                    key={task._id} 
                    to={`/tasks/${task._id}`}
                    className="flex items-center p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg mr-4 ${
                      task.status === 'Completed' ? 'bg-green-50 text-green-600' :
                      task.status === 'In Progress' ? 'bg-purple-50 text-purple-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <span className={`px-2 py-0.5 rounded-full mr-2 ${
                           task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                           task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {task.priority}
                        </span>
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-400 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                No tasks yet. Click "New Task" to get started!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-xl font-bold text-slate-900">Priority Breakdown</h2>
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              {['High', 'Medium', 'Low'].map(p => {
                const count = tasks.filter(t => t.priority === p).length;
                const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                const colors = {
                  High: 'bg-red-500',
                  Medium: 'bg-yellow-500',
                  Low: 'bg-blue-500'
                };
                return (
                  <div key={p} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-600">{p} Priority</span>
                      <span className="text-slate-900">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[p]} transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
           </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Create New Task"
      />
    </div>
  );
};

export default Dashboard;
