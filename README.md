# Workflow System - Technical Design Document

## Installation 

- Clone repository
- Install node_modules using `pnpm install`
- Build the project once `pnpm run build`
- Run the development server `pnpm run dev`
- Head over to `localhost:5173` to access the project UI
- Deployed version can be found [here]()

## Architecture Overview

The workflow system implements a task orchestration platform using React and TypeScript, with several key architectural decisions:

### State Management

- **Zustand over Redux**: Zustand was chosen for its minimal boilerplate, superior TypeScript integration, and simpler API. The system uses three primary stores:
  1. **`WorkflowStore`**: Manages workflow definitions, task configurations, and their relationships.
  2. **`TaskDefinitionStore`**: Handles task type registration, schema validation, and metadata.
  3. **`ExecutionStore`**: Controls runtime execution state, logging, and live status updates.

Each store follows a modular architecture, ensuring clear separation of responsibilities and ease of testing.

### Performance Optimizations

1. **Batch Processing**

The system includes a `BatchExecutor` to optimize state updates and reduce React re-renders:

```typescript
class BatchExecutor {
  private batchSize: number = 5;
  private batchTimeout: number = 1000;
  private updates: BatchUpdate[] = [];

  addUpdate(update: BatchUpdate): void {
    this.updates.push(update);
    if (this.updates.length >= this.batchSize) {
      this.flushUpdates();
    } else {
      setTimeout(() => this.flushUpdates(), this.batchTimeout);
    }
  }

  private flushUpdates(): void {
    // Process and apply all updates
    this.updates.forEach(update => update.apply());
    this.updates = [];
  }
}
```

- **Key Features**:
  - Configurable batch size and timeout for flexibility.
  - Automatic flushing to ensure timely updates.
  - Enhances UI responsiveness by reducing frequent re-renders.

2. **Component Optimization**

- **React.memo**: Applied to expensive components to avoid unnecessary re-renders.
- **Efficient Drag-and-Drop**: Utilizes libraries like `react-beautiful-dnd` for seamless task reordering with minimal performance overhead.
- **Memoized Callbacks**: `useCallback` is used for event handlers to prevent unnecessary re-creation of functions during renders.

### Task Execution Architecture

1. **Separation of Concerns**

Execution responsibilities are distributed across specialized classes:

```typescript
class TaskExecutor {
  async executeTask(config: TaskConfig): Promise<TaskResult> {
    switch (config.type) {
      case "email": return this.executeEmailTask(config);
      case "log": return this.executeLogTask(config);
      case "calculation": return this.executeCalculationTask(config);
      default: throw new Error(`Unsupported task type: ${config.type}`);
    }
  }

  private async executeEmailTask(config: TaskConfig): Promise<TaskResult> {
    // Email-specific execution logic
  }

  private async executeLogTask(config: TaskConfig): Promise<TaskResult> {
    // Logging-specific execution logic
  }

  private async executeCalculationTask(config: TaskConfig): Promise<TaskResult> {
    // Calculation-specific execution logic
  }
}
```

- **TaskExecutor**: Dedicated to individual task execution, with specialized methods for different task types.
- **BatchExecutor**: Manages state update batching and optimization.
- Clear boundaries between execution logic and state management ensure modularity and maintainability.

2. **Error Handling**

- **Task-Level Capture**: Each task has dedicated error-handling mechanisms to catch and report issues.
- **Error Propagation**: Errors bubble through the execution chain, enabling higher-level components to react appropriately.
- **UI Feedback**:
  - Toast notifications inform users of errors in real-time.
  - Error states are preserved in the store for debugging and retrying.

### Code Organization

1. **Component Structure**

- **Modular Design**:
  - Components are organized by feature and functionality.
  - Shared components reside in `/components/ui`, promoting reusability.
- **Separation of Concerns**:
  - UI components handle rendering and user interaction.
  - Business logic resides in stores and executors.
  - Dedicated modules for utilities and helper functions.

2. **Task Type System**

The system uses an extensible task definition model to support diverse workflows:

```typescript
interface TaskDefinition {
  type: string;
  schema: {
    inputs: Record<string, SchemaField>;
    outputs: Record<string, SchemaField>;
  };
  validator?: (config: any) => boolean;
}
```

- **Core Features**:
  - **Schema Validation**: Ensures task configurations conform to predefined input and output requirements.
  - **Extensibility**: Developers can register new task types by defining their schema and execution logic.
  - **Type Safety**: Leverages TypeScript to enforce strict typing and reduce runtime errors.

### Key Technical Decisions

1. **State Updates**

- **Batch Processing**: Reduces React re-renders and improves performance.
- **Optimistic Updates**: Provides immediate UI feedback while awaiting backend confirmation.
- **Atomic Transitions**: Ensures state consistency during updates.

2. **Type Safety**

- Comprehensive TypeScript usage throughout the codebase.
- **Runtime Validation**: Complements static typing by validating configurations during execution.
- **Generic Constraints**: Enforces strict typing for task definitions and execution logic.

3. **UI/UX Considerations**

- **Real-Time Feedback**: Displays task execution progress and results instantly.
- **Drag-and-Drop**: Enables intuitive task reordering.
- **Notifications**: Uses toast messages for errors and success states.
- **Loading States**: Provides visual indicators for ongoing operations.


