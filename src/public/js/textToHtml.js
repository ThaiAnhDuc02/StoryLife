
// Hàm chuyển đổi văn bản có thẻ HTML thành nội dung HTML thực tế
function textToHtml(text) {
    var contentElement = document.createElement('div');
    contentElement.innerHTML = text;
    return contentElement;
}
 