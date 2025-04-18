const { time } = require("console")

const baseUrl = "https://demotarget.msslab.redlabnet.com"

const username = 'user'
const password = 'pass'
const altpassword = 'bob'
const timeoutMillisecs = 1000

let token = ''

function pickRandomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}
function delay(t, val) {
  return new Promise(resolve => setTimeout(resolve, t, val));
}
const login = async (userId, useAltPass = false) => {
  const loginUrl = baseUrl + "/login"
  return await fetch(loginUrl).then(async () => {
      const loginApiUrl = baseUrl + '/api/login'
      const randoUser = userId ?  userId : pickRandomNumber()
      const user = username + randoUser
      const pass = useAltPass ? altpassword + randoUser : password + randoUser

      console.log(`/login/api with username ${user} and alternative password ${useAltPass}`)
      const res = await fetch(loginApiUrl, {
          method: 'POST',
          redirect: 'manual',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },

          body: `username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
        });
        if (res.status == 401 && !useAltPass) {
          console.log("Login failed, trying again with altpassword")
          //setTimeout(async () => {
            return await login(randoUser, true)
          //}, 7 * timeoutMillisecs) // Type password
        }
        
        // Get the token
        const cookies = res.headers.getSetCookie();
  
        if (cookies) {
          token = cookies
        }
        console.log(`/api/login returned ${res.status}`)
        return res
  })
}

const profile = async () => {
  const profileUrl = baseUrl + '/profile'
  const res = await fetch (profileUrl, { 
      redirect: 'manual',
      headers: {
          'Cookie': token
      }
  })
  console.log(`/profile returned ${res.status}`)
  return res
}

const report = async () => {
  const reportUrl = baseUrl + '/report'
  const res = await fetch (reportUrl, {
      redirect: 'manual', 
      headers: {
          'Cookie': token
      }
  })
  console.log(`/report returned ${res.status}`)
  return res
}

const main = async () => {
  const response = fetch(baseUrl).then(async (resRoot) => {
      //setTimeout(async () => {
        return login().then(async (resLogin) =>{
            //setTimeout(async () => {
                if (resLogin.status < 400) {
                    return await profile().then(async (resProfile) => {
                        if (resProfile.status == 200) {
                            const odds = pickRandomNumber()
                            if (odds > 8) {
                                //setTimeout(async () => {
                                    console.log('changing password')
                                    return //await changepass()
                                //}, 8 * timeoutMillisecs) // type two passwords
                            }
                            //setTimeout(async () => {
                                await report()
                            //}, timeoutMillisecs) // click
                        }
                    })
                }
            //}, 5 * timeoutMillisecs) // type user/pass
        })
      //},timeoutMillisecs) // click
  })
}

main()