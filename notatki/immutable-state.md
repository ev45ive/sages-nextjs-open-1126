
https://en.wikipedia.org/wiki/Persistent_data_structure

```tsx
type Task = { id: number; label: string };


function App() {

  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, label: 'Przeczytaj JSX' },
    { id: 2, label: 'Sprawdź drzewo' },
  ]);

  // filteredTasks = useMemo( tasks.filter(...), [query]) // 
  const filteredTasks =  tasks.filter(...), [query]) // Compiler Memo

  // const addAtStart = useCallback(() => {..},[tasks])
  function addAtStart() {
    // SELECT posts WHERE ...
    
    // user 1
    // likes = post.likes + 1
    // UPDATE posts VALUES post.likes = ${likes} // SET VALUE

    setTasks( [
      { id: 123, label: 'Nowe zadanie' },
       ...tasks
    ]); 

    tasks.length == 2;

    // user 2
    // UPDATE posts VALUES post.likes = post.likes + 1 // UPDATE

    setTasks( items =>  [
      { id: 1236, label: 'Nowe zadanie 2' },
       ...items  // current tasks!
    ]);

    tasks.length == 2;

    // tasks // 0x1234
    // tasks.push({id:123,label:'test'}); // Mutating state
    // tasks // 0x1234

    // setTasks(tasks) // Shallow eq: Stable reference 0x1234 === 0x1234
    // setTasks([...tasks]) // Shallow eq: Stable reference 0x1234 === 0x5421
  }

  function removeLast() {
    setTasks(items => items.slice(0, -1));
  }


  // vdom1 = f(props1, fiber1)
  // vdom2 = f(props1, fiber2)
  return (
    <section>
      <button onClick={addAtStart}>Dodaj na początku</button>
      <button onClick={removeLast}>Usuń ostatni</button>
      <ul>
        {tasks.map(task => <li key={task.id}>{task.label}</li>)}
      </ul>
    </section>
  );
}
```