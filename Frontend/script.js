AOS.init();
 
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/Frontend/pages/Login/login.html';
}


