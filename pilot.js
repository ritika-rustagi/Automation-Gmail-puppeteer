let puppeteer = require("puppeteer");
let fs = require("fs");
let credentialsFile = process.argv[2];

(async function () {
    try{
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    let url = credentials.url;
    let user = credentials.user;
    let pwd = credentials.pwd;

    let emails=await fs.promises.readFile("metadata.json");
    let id=JSON.parse(emails);
    // starts browser
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"]
        
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    
    await tab.goto(url, {
        waitUntil: "networkidle2",
        timeout:0
    });

    await tab.click("a[data-gps-track='login.click']");
    await tab.goto("https://accounts.google.com/signin/oauth/identifier?client_id=717762328687-iludtf96g1hinl76e4lc1b9a82g457nn.apps.googleusercontent.com&scope=profile%20email&redirect_uri=https%3A%2F%2Fstackauth.com%2Fauth%2Foauth2%2Fgoogle&state=%7B%22sid%22%3A1%2C%22st%22%3A%2259%3A3%3ABBC%2C16%3Ac808faa12b32aa9c%2C10%3A1591039068%2C16%3A28e493029f188074%2C5d73928286ad3f07cb1e5ad3cebfcea42c5e0e4225bb80da6c962c17348bd83b%22%2C%22cdl%22%3Anull%2C%22cid%22%3A%22717762328687-iludtf96g1hinl76e4lc1b9a82g457nn.apps.googleusercontent.com%22%2C%22k%22%3A%22Google%22%2C%22ses%22%3A%22b6d1444bedae420999a37299fc4cb963%22%7D&response_type=code&o2v=1&as=-FqdwWUC6RutUi_1u_aUcQ&flowName=GeneralOAuthFlow",{waitUntil:"networkidle2"})

    await tab.type("input[type='email']",user,{delay:30});
    await tab.keyboard.press("Enter");
    // await Promise.all([tab.keyboard.press("Enter"), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
    // await tab.waitForNavigation({ waitUntil: "networkidle0" });
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle0"
    })]);
    await tab.waitFor(1000);
    // await tab.waitForNavigation({waitUntil:"networkidle0"});
    await tab.waitForSelector("input[type='password']",{timeout:10000});
    await tab.type("input[type='password']",pwd,{delay:300});
    // console.log(pwd);
    await tab.keyboard.press("Enter");

    await tab.waitForNavigation({ waitUntil:"networkidle2"});
    let inbox="https://gmail.com/";
    await tab.goto(inbox,{waitUntil:"networkidle2"});

    await tab.waitForSelector(".T-I.J-J5-Ji.T-I-KE.L3");
    console.log("compose");
    await tab.click(".T-I.J-J5-Ji.T-I-KE.L3");

    console.log(id);
    for(let key in id){
        await tab.waitForSelector(".aoD.hl");
        await tab.type(".aoD.hl",id[key],{delay:200});
        await tab.keyboard.press("Enter");
    }

    let subject="This is an automated mail. ";
    await tab.waitForSelector("input[name='subjectbox']");
    await tab.type("input[name='subjectbox']",subject,{delay:200});

    let body="This is automatically generated mail. Please do not reply!!!";
    await tab.waitForSelector(".Am.Al.editable.LW-avf.tS-tW");
    await tab.type(".Am.Al.editable.LW-avf.tS-tW",body,{delay:200});

    await tab.waitForSelector(".gU.Up");
    await tab.click(".gU.Up");

    await tab.waitFor(3000);

    console.log("Mail Sent");

    await tab.waitForSelector(".n6 span[role='button']");
    await tab.click(".n6 span[role='button']");
    await tab.waitFor(2000);

    await tab.waitForSelector(".TN.bzz.aHS-bnv");
    await tab.click(".TN.bzz.aHS-bnv");
    await tab.waitFor(3000);

    await tab.waitForSelector(".ya span[role='button']");
    await tab.evaluate(()=>{
        document.querySelector(".ya span[role='button']").click();
    })
     
    await tab.waitFor(2000);
    await tab.waitForSelector(".J-at1-auR.J-at1-atl");
    await tab.evaluate(()=>{
        document.querySelector(".J-at1-auR.J-at1-atl").click();
    })

    await tab.waitFor(2000);

    console.log("Spam Deleted");
    
}catch(err){
    console.log(err);
}

    
        
})()
