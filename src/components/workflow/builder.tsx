import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List, MoveDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkflowStore } from '@/store/workflow.store';
import WorkflowExecutor from './executor';
import TaskList from '../task/taskList';
import WorkflowFlowchart from './chart';

const WorkflowBuilder = () => {
  const { workflows, addWorkflow } = useWorkflowStore();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const handleAddWorkflow = () => {
    const workflow = addWorkflow(`Workflow ${workflows.length + 1}`);
    setSelectedWorkflow(workflow.id);
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Workflow Builder</h1>
        <Button onClick={handleAddWorkflow} className="flex items-center gap-2">
          <Plus size={16} /> Add Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className={`cursor-pointer ${selectedWorkflow === workflow.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <CardHeader>
                  <CardTitle>{workflow.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {workflow.tasks.length} tasks
                  </div>
                  <div className="mt-2">
                    Status: {workflow.status}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedWorkflowData && (
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedWorkflowData.name}</CardTitle>
                <WorkflowExecutor workflowId={selectedWorkflowData.id} />
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list">
                  <TabsList>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <List size={16} /> List View
                    </TabsTrigger>
                    <TabsTrigger value="flowchart" className="flex items-center gap-2">
                        <MoveDown size={16}/> Flowchart
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">
                    <TaskList workflowId={selectedWorkflowData.id} />
                  </TabsContent>
                  <TabsContent value="flowchart">
                    <WorkflowFlowchart workflowId={selectedWorkflowData.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;