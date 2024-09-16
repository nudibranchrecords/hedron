import debounce from 'lodash.debounce'

type Func = () => void

// debounce a function but with multiple instances. Simultaneous calls can happen if the id is different

const pool: { [id: string]: Func } = {}

export const debounceWithId = (func: Func, wait: number, id: string) => {
  if (!pool[id]) {
    pool[id] = debounce(func, wait)
  }

  console.log(id)

  pool[id]()
}
