// utils/complaintsTransform.js
export const groupByKey = (data, key) => {
  const map = {};
  data.forEach(item => {
    const k = item[key] ?? "Unknown";
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

export const groupByDate = (data) => {
  const map = {};
  data.forEach(item => {
    const date = new Date(item.CreatedAt).toISOString().split("T")[0];
    map[date] = (map[date] || 0) + 1;
  });

  return Object.entries(map)
    .map(([date, value]) => ({ date, value }))
    .sort((a,b) => new Date(a.date) - new Date(b.date));
};
