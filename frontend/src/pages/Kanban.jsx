import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { taskService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { AlertCircle, Clock, CheckCircle2, MoreVertical } from 'lucide-react';

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    const task = tasks.find(t => t._id === draggableId);

    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t._id === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(draggableId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status', error);
      fetchTasks(); // Revert on failure
    }
  };

  const columns = {
    'Pending': {
      id: 'Pending',
      title: 'Pending',
      tasks: tasks.filter(t => t.status === 'Pending'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: Clock
    },
    'In Progress': {
      id: 'In Progress',
      title: 'In Progress',
      tasks: tasks.filter(t => t.status === 'In Progress'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      icon: AlertCircle
    },
    'Completed': {
      id: 'Completed',
      title: 'Completed',
      tasks: tasks.filter(t => t.status === 'Completed'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      icon: CheckCircle2
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kanban Board</h1>
        <p className="text-slate-500 dark:text-slate-400">Drag and drop tasks to change status</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex flex-col h-full min-h-[500px]">
              <div className={`flex items-center justify-between p-4 rounded-t-xl ${column.bgColor} border-b-2 border-white dark:border-slate-800 shadow-sm`}>
                <div className="flex items-center space-x-2">
                  <column.icon className={`h-5 w-5 ${column.color}`} />
                  <h2 className="font-bold text-slate-800 dark:text-slate-200">{column.title}</h2>
                  <span className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-600">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-grow p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl border-x border-b border-slate-100 dark:border-slate-700 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-700/50' : ''
                    }`}
                  >
                    <div className="space-y-4">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all ${
                                snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-primary-500' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                                  {task.title}
                                </h3>
                                <button className="text-slate-400 hover:text-slate-600">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                    task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                    task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
