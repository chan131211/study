//格式化日期
export function getDate(time) {
    if(!time) return
        let date = new Date(time)
        let dateRes = date.getFullYear() + '-'
        + date.getMonth() + '-'
        + date.getDate() + ' '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds() 
        return dateRes
    
}