<a href="https://travis-ci.org/adamdavies001/react-hooks-object-state"><img src="https://travis-ci.org/adamdavies001/react-hooks-object-state.svg?branch=master" alt="Travis Build Status"></a>
<a href="https://ci.appveyor.com/project/adamdavies001/react-hooks-object-state"><img src="https://ci.appveyor.com/api/projects/status/jc0a2g2t7t4logcu/branch/master?svg=true" alt="Windows Build Status"></a>
<a href="https://badge.fury.io/js/react-hooks-object-state"><img src="https://badge.fury.io/js/react-hooks-object-state.svg" alt="npm version"></a>

## About

This package is a React hook for partially updating object states within functional components that avoids the default behavior of `useState` that overwrites the entire object state. It reflects the merge behavior of `setState` used in classical components.

**Use this** when you need an object state that shouldn't be split up into multiple states.  
**Don't use this** if you only need an object state with a few simple properties.

## Features

- Partially update object values in state without erasing any non-updated entries
- Calculate new values based on the previous state with a function argument

## Install

```bash
$ npm install react-hooks-object-state
```

Peer dependencies: react (^16.8.0)

## Usage

Within a functional component, simply declare and use the `useObjectState` hook to create a state object. Then pass any object updates to the returned setter function to update the original object.

```jsx
import React from 'react'
import useObjectState from 'react-hooks-object-state'

const Example = () => {
  const [myObject, setMyObject] = useObjectState({bool: true, string: 'foo'})

  const updateObject = () => {
    setMyObject({bool: false})
  }

  return <button onClick={updateObject}>Update object</button>
}

// myObject after update:
// {
//   bool: false,
//   string: 'foo'
// }
```

#### Passing a function

Alternatively, you can pass a function to the setter if you need to use the previous state to calculate new state values.

```jsx
const updateObject = () => {
  setMyObject((state) => {
    return {
      string: state.str + 'bar'
    }
  })
}
```

The use of `props` in function arguments is not included since hooks are not able to read component props, and workarounds would not effectively replicate the classical `setState` behavior.

#### Additional info

An initial object **must** be provided to `useObjectState`. This hook deep-merges objects by copying common entries from a source to a target object.

Like the classical `setState` method, this does not create entries if they don't already exist. Providing an empty initial object will always result in an empty object.