import { toast } from "@/hooks/use-toast";
import {
  CalculationConfig,
  EmailConfig,
  LogConfig,
  Operation,
  TaskResult,
} from "../types/task.types";

export class TaskExecutor {
  private async executeEmailTask(config: EmailConfig): Promise<TaskResult> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Email Sent",
        description: `To: ${config.to}\nSubject: ${config.subject}`,
      });
      return {
        success: true,
        outputs: { sent: true },
      };
    } catch (error) {
      return {
        success: false,
        outputs: { sent: false },
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }

  private async executeLogTask(config: LogConfig): Promise<TaskResult> {
    try {
      console.log(config.message);
      return {
        success: true,
        outputs: { logged: true },
      };
    } catch (error) {
      return {
        success: false,
        outputs: { logged: false },
        error: error instanceof Error ? error.message : "Failed to log message",
      };
    }
  }

  private async executeCalculationTask(
    config: CalculationConfig
  ): Promise<TaskResult> {
    try {
      const result = this.performCalculation(
        config.operation,
        config.value1,
        config.value2
      );
      return {
        success: true,
        outputs: { result },
      };
    } catch (error) {
      return {
        success: false,
        outputs: { result: 0 },
        error: error instanceof Error ? error.message : "Calculation failed",
      };
    }
  }

  private performCalculation(
    operation: Operation,
    value1: number,
    value2: number
  ): number {
    switch (operation) {
      case "add":
        return value1 + value2;
      case "subtract":
        return value1 - value2;
      case "multiply":
        return value1 * value2;
      case "divide":
        if (value2 === 0) throw new Error("Division by zero");
        return value1 / value2;
      default:
        throw new Error("Invalid operation");
    }
  }

  async executeTask(
    taskConfig: EmailConfig | LogConfig | CalculationConfig
  ): Promise<TaskResult> {
    console.log({ taskConfig });
    switch (taskConfig.type) {
      case "email":
        return this.executeEmailTask(taskConfig);
      case "log":
        return this.executeLogTask(taskConfig);
      case "calculation":
        return this.executeCalculationTask(taskConfig);
      default:
        return {
          success: false,
          //@ts-ignore
          outputs: {},
          error: "Unknown task type",
        };
    }
  }

  async executeWorkflow(
    tasks: (EmailConfig | LogConfig | CalculationConfig)[]
  ): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    for (const task of tasks) {
      const result = await this.executeTask(task);
      results.push(result);

      if (!result.success) {
        break; // Stop workflow execution on first failure
      }
    }
    return results;
  }
}
