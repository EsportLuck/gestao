export function nextSunday(data: Date | string) {
  if (!data) {
    data = new Date();
  } else {
    data = new Date(data);
  }

  if (data.getDay() === 0) {
    return { today: data, sunday: data };
  }

  var dateDomingo = new Date(data);
  dateDomingo.setDate(data.getDate() + (7 - data.getDay()));
  const sunday = new Date(new Date(dateDomingo).setUTCHours(20, 59, 59, 999));

  return { today: data, sunday };
}
