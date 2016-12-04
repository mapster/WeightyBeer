export const ADD_TAP = 'ADD_TAP';
export function addTap(tap) {
  return {
    type: ADD_TAP,
    tap: {
      name: tap.name
    }
  }
}
