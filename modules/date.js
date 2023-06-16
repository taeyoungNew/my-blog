// 날짜를 리턴하는 모듈
const getDate = () => {
  const date = new Date()
  const todayYear = date.getFullYear()
  const todayMonth = ('0' + (date.getMonth() + 1)).slice(-2);
  const todayDate = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2);

  const todaytString = `${todayYear}-${todayMonth}-${todayDate} ${hours}:${minutes}`
  return todaytString;
}
getDate()

module.exports = getDate