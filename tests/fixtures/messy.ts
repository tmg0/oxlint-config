import { foo, bar } from 'node:os'

var x = 1
const y = x == 2 ? 'a' : 'b'

export function demo(): string {
  let z = 3
  return y + foo + bar + z
}
