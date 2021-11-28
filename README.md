# Tiny-RX-Store

## Commands

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `yarn build`.

To run tests, use `yarn test`.

## Configuration

Code quality is set up with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

## Continuous Integration

### GitHub Actions

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Usage

```ts
interface Person {
  person: {
    name: string;
    age: number;
    friends: {
      name: string;
      occupation: string;
    }[];
  };
}

// Create store with default state
const store = new Store<Person>({
  person: {
    name: 'Randy Rhoads',
    age: 25,
    friends: [
      { name: 'Ozzy Osbourne', occupation: 'Singer' },
      { name: 'Jimi Hendrix', occupation: 'Guitar Player' },
    ],
  },
});

// Create observables based on state properties
store.selectStateByKey('person').subscribe(console.log);
store.selectStateByKey('person', 'friends', 0).subscribe(console.log);

// Create a custom state selector
store.selectState(state => {
  return state.person.friends.filter(
    friend => friend.occupation === 'Guitar Player'
  );
}).subscribe(console.log);

// Update state manually with a reducer
store.updateState(state => {
  return {
    ...state,
    person: {
      ...state.person,
      friends: [
        ...state.person.friends,
        { name: 'Dave Grohl', occupation: 'Drummer' },
        { name: 'Zakk Wylde', occupation: 'Guitar Player' },
      ],
    },
  };
});

// Also includes support for actions
class AddFriends {
  static readonly type = '[Person] Add Friends';
  constructor(public payload: { name: string, occupation: string }[]) {
  }
}

// Register a reducer with an action
store.registerReducer((state, action: AddFriends) => {
  return {
    ...state,
    person: {
      ...state.person,
      friends: [
        ...state.person.friends,
        ...action.payload
      ],
    },
  };
}, AddFriends);

// Dispatch action
store.dispatch(new AddFriends([
  { name: 'Bob', occupation: 'Programmer' },
  { name: 'Alice', occupation: 'Security' }]
));
```