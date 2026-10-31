import { TasksContainer } from "@/components/task-container/task-container";
import { TaskForm } from "@/components/task-input/task-input-form";

export default function TaskupPage(){
    return(
        <>
            <h1>TaskUp Page</h1>
            <TaskForm/>
            <TasksContainer/>
        </>
    )
}