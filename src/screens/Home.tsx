import { useDelete, useGet, usePost, usePut } from "@/lib/api";
import { useLinkTo } from "@react-navigation/native";
import { useQueryClient } from '@tanstack/react-query';
import { TouchableOpacity, View } from "react-native";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const QUERY_KEYS = {
  TODO: (id: number) => ['todo', id] as const,
  TODOS: ['todos'] as const,
}

export default function Home() {
  const queryClient = useQueryClient()

  const linkTo = useLinkTo();
  const logoutMutation = usePost<null, null>();

  async function logout() {
    await logoutMutation.mutateAsync({
      url: '/auth/logout'
    });
    queryClient.removeQueries({ queryKey: ['userMe'] })
    // setUser(null);
  }


  // Using our custom useGet hook
  const {
    data: todo,
    isLoading,
    isError,
    refetch
  } = useGet<Todo>(
    {
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      queryKey: QUERY_KEYS.TODO(1),
    }
  )

  // Using mutation hooks with query invalidation
  // When mutations complete, they'll automatically invalidate the TODO query
  const createTodo = usePost<Todo, Omit<Todo, 'id'>>({
    invalidateQueries: QUERY_KEYS.TODOS
  });

  const updateTodo = usePut<Todo, Partial<Todo>>({
    invalidateQueries: todo ? QUERY_KEYS.TODO(todo.id) : undefined
  });

  const deleteTodo = useDelete<void>({
    invalidateQueries: QUERY_KEYS.TODOS
  });

  // Example handlers
  const handleCreate = () => {
    createTodo.mutate({
      url: 'https://jsonplaceholder.typicode.com/todos',
      data: {
        userId: 1,
        title: 'New Todo',
        completed: false
      }
    });
  };

  const handleUpdate = (id: number) => {
    updateTodo.mutate({
      url: `https://jsonplaceholder.typicode.com/todos/${id}`,
      data: {
        completed: true
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteTodo.mutate({
      url: `https://jsonplaceholder.typicode.com/todos/${id}`
    });
  };

  async function handleLogout() {
    try {
      await logout();
      linkTo('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return <div>Home Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <View className="flex flex-col items-center justify-center min-h-svh">
      <TouchableOpacity onPress={handleLogout}>
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </TouchableOpacity>
      <div className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Todo Example</h1>

        {todo && (
          <div className="p-4 border rounded">
            <h2 className="font-semibold">{todo.title}</h2>
            <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
            <div className="mt-2 space-x-2">
              <TouchableOpacity
                onPress={() => handleUpdate(todo.id)}
                disabled={updateTodo.isPending}
              >
                {updateTodo.isPending ? 'Updating...' : 'Mark Complete'}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(todo.id)}
                disabled={deleteTodo.isPending}
              >
                {deleteTodo.isPending ? 'Deleting...' : 'Delete'}
              </TouchableOpacity>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <TouchableOpacity
            onPress={handleCreate}
            disabled={createTodo.isPending}
          >
            {createTodo.isPending ? 'Creating...' : 'Create New Todo'}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => refetch()}
          >
            Refresh
          </TouchableOpacity>
        </div>

        {/* Mutation status messages */}
        {createTodo.isSuccess && <p className="text-green-500">Todo created successfully!</p>}
        {updateTodo.isSuccess && <p className="text-green-500">Todo updated successfully!</p>}
        {deleteTodo.isSuccess && <p className="text-green-500">Todo deleted successfully!</p>}
      </div>
    </View>
  )
}