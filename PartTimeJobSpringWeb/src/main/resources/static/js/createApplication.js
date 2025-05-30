/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


async function getList(endpoint) {
    try {
        const response = await fetch(endpoint, {method: 'GET'});
        if (!response.ok) {
            throw new Error("Lỗi khi truy vấn danh sách việc làm!");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi truy vấn danh sách việc làm!');
        return null;
    }
}
