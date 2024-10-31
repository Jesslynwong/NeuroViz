/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-10-24 11:34:59
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-24 11:48:29
 * @FilePath: /dataVis/src/utils/colors.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const getColor = (index: number) => {
    const colors = ["#91cc75", "#5470c6", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"]
    const colorIndex = index % colors.length
    return colors[colorIndex]
}

