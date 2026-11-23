export const examples = [
  {
    id: 'static-jsx',
    title: '1. JSX i zagnieżdżenie',
    code: `function App() {
  return (
    <main>
      <h1>Witaj w React</h1>
      <p>JSX opisuje elementy interfejsu.</p>
    </main>
  );
}`
  },
  {
    id: 'conditional-render',
    title: '2. Warunkowe renderowanie i stan',
    code: `function App() {
  const [visible, setVisible] = React.useState(true);
  function toggle() {
    setVisible(value => !value);
  }
  return (
    <section>
      <button onClick={toggle}>Zmień widoczność</button>
      {visible && <p>Ten element jest widoczny</p>}
    </section>
  );
}`
  },
  {
    id: 'props-children',
    title: '3. Komponent, props i children',
    code: `function Card({ title, children }: { title: string; children: unknown }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
function App() {
  return (
    <main>
      <Card title="Komponent z props">
        <p>To children przekazane do Card.</p>
        <strong>Zagnieżdżony element</strong>
      </Card>
    </main>
  );
}`
  },
  {
    id: 'keyed-list',
    title: '4. Kolekcja, map i key',
    code: `type Task = { id: number; label: string };
function App() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, label: 'Przeczytaj JSX' },
    { id: 2, label: 'Sprawdź drzewo' },
  ]);
  function addAtStart() {
    setTasks(items => [{ id: Math.max(0, ...items.map(item => item.id)) + 1, label: 'Nowe zadanie' }, ...items]);
  }
  function removeLast() {
    setTasks(items => items.slice(0, -1));
  }
  return (
    <section>
      <button onClick={addAtStart}>Dodaj na początku</button>
      <button onClick={removeLast}>Usuń ostatni</button>
      <ul>
        {tasks.map(task => <li key={task.id}>{task.label}</li>)}
      </ul>
    </section>
  );
}`
  },
  {
    id: 'keyed-state-reorder',
    title: '5. Key, kolejność i lokalny stan',
    code: `type ItemData = { id: string; label: string };
function Item({ item }: { item: ItemData }) {
  const [selected, setSelected] = React.useState(false);
  function toggle() {
    setSelected(value => !value);
  }
  return (
    <li>
      <button onClick={toggle}>{selected ? 'Wybrane' : 'Wybierz'}: {item.label}</button>
    </li>
  );
}
function App() {
  const [items, setItems] = React.useState<ItemData[]>([
    { id: 'a', label: 'Alfa' },
    { id: 'b', label: 'Beta' },
    { id: 'c', label: 'Gamma' },
  ]);
  function reverse() {
    setItems(list => [...list].reverse());
  }
  return (
    <section>
      <button onClick={reverse}>Odwróć kolejność</button>
      <ul>{items.map(item => <Item key={item.id} item={item} />)}</ul>
    </section>
  );
}`
  },
  {
    id: 'parent-child-callback',
    title: '6. Stan rodzica i callback przez props',
    code: `function Child({ onIncrement }: { onIncrement: () => void }) {
  const [childCount, setChildCount] = React.useState(0);
  function incrementChild() {
    setChildCount(value => value + 1);
  }
  return (
    <section>
      <button onClick={onIncrement}>Zmień stan rodzica</button>
      <button onClick={incrementChild}>Stan dziecka: {childCount}</button>
    </section>
  );
}
function App() {
  const [parentCount, setParentCount] = React.useState(0);
  function incrementParent() {
    setParentCount(value => value + 1);
  }
  return (
    <main>
      <h2>Stan rodzica: {parentCount}</h2>
      <Child onIncrement={incrementParent} />
    </main>
  );
}`
  },
  {
    id: 'memo-callback',
    title: '7. React.memo, callback i zmiana props',
    code: `function Child({ onIncrement, label }: { onIncrement: () => void; label: string }) {
  return <button onClick={onIncrement}>{label}</button>;
}
function App() {
  const [count, setCount] = React.useState(0);
  const [label, setLabel] = React.useState('Zwiększ');
  function increment() {
    setCount(value => value + 1);
  }
  function changeLabel() {
    setLabel(value => value === 'Zwiększ' ? 'Dodaj jeden' : 'Zwiększ');
  }
  return (
    <main>
      <h2>Licznik: {count}</h2>
      <button onClick={changeLabel}>Zmień label</button>
      <Child onIncrement={increment} label={label} />
    </main>
  );
}`
  },
  {
    id: 'referential-trap',
    title: '8. Nowy obiekt props przy każdym renderze',
    code: `function Child({ options }: { options: { color: string } }) {
  return <p title={options.color}>Kolor: {options.color}</p>;
}
function App() {
  const [count, setCount] = React.useState(0);
  const options = { color: 'blue' };
  function increment() {
    setCount(value => value + 1);
  }
  return (
    <main>
      <button onClick={increment}>Licznik: {count}</button>
      <Child options={options} />
    </main>
  );
}`
  },
  {
    id: 'inline-callback',
    title: '9. Inline callback w JSX',
    code: `function App() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(value => value + 1)}>
      Licznik: {count}
    </button>
  );
}`
  },
  {
    id: 'map-block',
    title: '10. Mapa z blokiem i return',
    code: `function App() {
  const items = ['Alfa', 'Beta', 'Gamma'];
  return (
    <ul>
      {items.map(item => {
        const label = item.toUpperCase();
        return <li key={item}>{label}</li>;
      })}
    </ul>
  );
}`
  }
];
