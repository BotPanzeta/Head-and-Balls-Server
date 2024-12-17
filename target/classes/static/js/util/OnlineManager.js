class OnlineManager {

  static IP = window.location.origin
  static username = ''
  static password = ''
  static isLogged = false
  

  //Checks
  static checkOnline(onCheck) {
    $.ajax({
      url: OnlineManager.IP + '/api/test',
      type: 'GET',
      success: (data) => {
        onCheck(true)
      },
      error: (error) => {
        onCheck(false, error)
      },
    })
  }

  static checkLogged(onCheck) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/check',
      type: 'GET',
      success: (data) => {
        OnlineManager.isLogged = true
        onCheck(OnlineManager.isLogged)
      },
      error: (error) => {
        OnlineManager.isLogged = false
        onCheck(OnlineManager.isLogged, error)
      },
    })
  }

  //Register/delete
  static register(username, password, onRegister) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/register',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        OnlineManager.isLogged = true
        onRegister(OnlineManager.isLogged)
      },
      error: (error) => {
        onRegister(OnlineManager.isLogged, error)
      },
    })
  }
  
  static deleteAccount(onDelete) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/delete',
      type: 'DELETE',
      success: (data) => {
        OnlineManager.isLogged = false
        onDelete(OnlineManager.isLogged)
      },
      error: (error) => {
        onDelete(OnlineManager.isLogged, error)
      },
    })
  }

  //Loggin/out
  static login(username, password, onLogin) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/login',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        OnlineManager.isLogged = true
        onLogin(OnlineManager.isLogged)
      },
      error: (error) => {
        onLogin(OnlineManager.isLogged, error)
      },
    })
  }

  static logout(onLogout) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/logout',
      type: 'POST',
      success: (data) => {
        OnlineManager.isLogged = false
        onLogout(OnlineManager.isLogged)
      },
      error: (error) => {
        onLogout(OnlineManager.isLogged, error)
      },
    })
  }
}