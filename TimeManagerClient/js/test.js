/**
 * 测试文件夹
 * by littlefean
 */


let arr = [
    {a: 23, b: [1, 2, 3]},
    {a: 23, b: [1, 2, 1555]},
]
// 一种效率很低的查找元素的方法
for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify({a: 23, b: [1, 2, 1555]})) {
        console.log("find!");
        break;
    }
}
