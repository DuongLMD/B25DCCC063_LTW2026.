export function matchesReducer(state, action) {
  switch (action.type) {
    case "LOAD": {
      return Array.isArray(action.payload) ? [...action.payload] : [];
    }

    case "ADD": {
      const maxId = state.reduce(
        (acc, item) => (typeof item.id === "number" && item.id > acc ? item.id : acc),
        0
      );
      const nextMatch = {
        ...action.payload,
        id: maxId + 1,
      };
      return [...state, nextMatch];
    }

    case "REMOVE": {
      return state.filter((item) => item.id !== action.payload);
    }

    case "SET_GOALS": {
      const { id, homeGoals, awayGoals } = action.payload;
      return state.map((item) =>
        item.id === id
          ? {
              ...item,
              homeGoals,
              awayGoals,
            }
          : item
      );
    }

    default:
      return state;
  }
}
