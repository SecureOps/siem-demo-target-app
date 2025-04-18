const baseUrl = "https://demotarget.msslab.redlabnet.com"


const timeoutMillisecs = 0

let maxBadTriesBeforeGoodTry = 40
let maxGoodTriesBeforeBadTry = 3
const maxTries = 1000


let token = ''
let count = 0
let isBadTry = true
let firstBadTry = 0
let firstGoodTry = 0
const username = 'user'
const password = 'pass'

function pickEvilRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

function pickNormalRandomNumber() {
    return Math.floor(Math.random() * 1000) + 10; // Ensure we never return < 11
}

//TODO: Replace all the commented out setTimeout() functions with delay()
function delay(t, val) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}
const login = async () => {
        const loginApiUrl = baseUrl + '/api/login'
        // Determine whether we use a valid user or an invalid user
        if ((isBadTry && (count - firstBadTry) >= maxBadTriesBeforeGoodTry)) {
            isBadTry = false
            firstGoodTry = count
        } else if ((!isBadTry && (count - firstGoodTry) >= maxGoodTriesBeforeBadTry)) {
            isBadTry = true
            firstBadTry = count
        }
       
        const randoId = isBadTry ? pickNormalRandomNumber() : pickEvilRandomNumber()

        const user = username + randoId
        const pass = password + randoId

        await delay(timeoutMillisecs) 

        const res = await fetch(loginApiUrl, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },

            body: `username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
        });

        console.log(`/api/login returned ${res.status} for user ${user} and flag ${isBadTry}`)
        return res
}


const main = async () => {
    while (count < maxTries) {
        const response = await login()
        // console.log(count)
        count += 1
    }
}

// UNCOMMENT for AWS Lambda
// export const handler = async (event) => {
//     return await main().then((res) => {
//       return {}
//     }).catch(async (err) => {
//       console.log(err)
//       return err
//     })
// };

// COMMENT OUT for AWS Lambda
main({})