
// Sử dụng document.cookie để lấy danh sách tất cả các cookies
const cookies = document.cookie.split(';');
console.log(cookies)

// Duyệt qua danh sách cookies để tìm cookie có tên "accessToken"
let accessToken = null;
for (const cookie of cookies) {
  const [name, value] = cookie.trim().split('=');
  if (name === 'accessToken') {
    accessToken = value;
    break;
  }
}

// Kiểm tra xem accessToken có tồn tại
if (accessToken !== null) {
  console.log('Access Token:', accessToken);
} else {
  console.log('Access Token not found');
}
