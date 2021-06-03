require("chromedriver");
let swd = require("selenium-webdriver");
let fs = require("fs");
const { parseHTML } = require("cheerio");
const { threadId } = require("worker_threads");
let medicineFile = process.argv[2];
let bldr=new swd.Builder();
let driver = bldr.forBrowser("chrome").build();
let url,number,pwd,pin,street,landmark,medicines,netmedLink,netmedCode,website;
( async function(){
    try{
        await driver.manage().window().maximize();
        let data = await fs.promises.readFile(medicineFile, "utf-8");
        let credentials = JSON.parse(data);
        url = credentials.url;
        number = credentials.number;
        pwd = credentials.pwd;
        pin=credentials.pin;
        street=credentials.street;
        landmark=credentials.landmark;
        medicines=credentials.medicines;
        website=credentials.website;
        await driver.get(url);
        await driver.manage().setTimeouts({
            implicit: 10000,
            pageLoad: 10000
        })
       await navig("a[href='https://www.netmeds.com/customer/account/login']");
        let phoneNum= await driver.findElement(swd.By.css("#loginfirst_mobileno"));
        await phoneNum.sendKeys(number);
        await navig("button.btn-signpass");
        let UsepassBox=await driver.findElement(swd.By.css("#login_received_pwd"));
        await UsepassBox.sendKeys(pwd);
        await navig("button.btn-login");
        await search(medicines);
        await navig("#minicart_btn");
        await grabon();
        await driver.get(netmedLink)
        let couponbtn=await driver.findElements(swd.By.css(".code"));
        await couponbtn[1].click();
        let Selectcpn=await driver.findElements(swd.By.css("#couponcode"));
        await Selectcpn[0].sendKeys(netmedCode);
        let applyBtn= await driver.findElements(swd.By.css("button.apply-coupon"));
        await applyBtn[0].click();
        await navig(".process-checkout .btn-checkout.btn.btn_to_checkout");
        await navig(".addchangeweb.col-md-4.text-right.p-0");
        await navig("a.newadd");
        console.log("");
        let pinBtn=await driver.findElement(swd.By.css("input#pin"));
        await pinBtn.click();
        await pinBtn.sendKeys(pin);
        let strBox=await driver.findElement(swd.By.css("#street"));
        await strBox.sendKeys(street);
        let lndBox=await driver.findElement(swd.By.css("#landmark"));
        await lndBox.sendKeys(landmark);
        let mno=await driver.findElement(swd.By.css("#mobile_no"));
        await mno.sendKeys(number);
        let saveBtn=await driver.findElements(swd.By.css("button.btn"));
        await saveBtn[3].click();
        await navig("#addressmodal");
        await navig(".btn-checkout.btn.btn_to_checkout.m-0");
        await navig("#nms_cod");
        await navig("button.float-right.process-orderplace.col-md-5.col-12");
        console.log("Hurray !! YOUR ORDER IS PLACED ")
    }   catch (err) {
        console.log(err);
    }
})()

 async function navig(selector){
         let clicked=await driver.findElement(swd.By.css(selector));
         await clicked.click();
 }
async function search(medicines)
{   try{
         for(let i =0;i<medicines.length;i++)
       {
    let searchBox=await driver.findElement(swd.By.css("input#search"));
    await searchBox.sendKeys(medicines[i]);
   await navig("button.iconSearch");
    let qtybtn=await driver.findElements(swd.By.css(".drug_list .qty-list"));
    await qtybtn[0].click();
    let addToCart=await driver.findElements(swd.By.css("button.toCart.cartbag"));
    await addToCart[0].click();
    }
   }catch (err) {
    console.log(err);
}
}
 async function grabon()
{try {
    netmedLink = await driver.getCurrentUrl();
    await driver.get(`https://www.grabon.in/${website}-coupons/`);
    let coupnCode= await driver.findElements(swd.By.css(".go-cBtn a.go-coupBtn"));
    netmedCode=await coupnCode[0].getText();
    console.log("GRABON COUPON --> "+netmedCode);
} catch(err)
{
    console.log(err);
}
}
