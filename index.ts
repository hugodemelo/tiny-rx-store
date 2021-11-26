import { Store } from './store/store';

interface Person {
  person: {
    name: string;
    age: number;
    friends: {
      name: string;
      occupation: string;
    }[];
  }
}

interface Book {
  book: {
    pages: number;
  }
}

const store = new Store<Person & Book>({
  person: {
    name: 'Randy Rhoads',
    age: 25,
    friends: [
      { name: 'Ozzy Osbourne', occupation: 'Singer' },
      { name: 'Jimi Hendrix', occupation: 'Guitar Player' },
    ]
  },
  book: {
    pages: 355
  }
});

store.selectState('person', 'friends', 0).subscribe(console.log);
store.selectState('book', 'pages').subscribe(console.log);

store.updateState({ book: { pages: 233 } });

store.updateState({ person: { friends: [{ name: 'Zakk Wylde', occupation: 'Guitar Player' }] } });

