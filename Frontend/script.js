AOS.init();
 
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/pages/Login/login.html';
}


