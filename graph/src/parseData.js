
// Parses the data into the structure used by the d3 graph
export function parseData(filterList, records) {

  return {
    points: records,
    selected: records.filter(([name]) => {
      return filterList.find(filter => name.includes(filter)) !== undefined;
    }),
  };
}
