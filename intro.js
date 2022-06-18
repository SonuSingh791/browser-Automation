const puppeteer = require("puppeteer");
// console.log("before");
let currPage;
// let browserOpenPromises = puppeteer.launch({
//   headless: false,
//   slowMo: true,
//   defaultViewport: null,
//   args: ["--start-maximized"],
// });
// browserOpenPromises
//   .then(function (browser) {
//     // console.log("browser opened");
//     let pagesArrPromises = browser.pages();
//     return pagesArrPromises;
//   })
//   .then(function (browserPages) {
//     currPage = browserPages[0];
//     let gotoPromise = currPage.goto("https://www.instagram.com");
//     return gotoPromise;
//   })
//   .then(function () {
//     let elementWaitPromise = currPage.waitForSelector("input[type='text']", {
//       visible: true,
//     });
//     return elementWaitPromise;
//   })
//   .then(function () {
//     // console.log("Goggle Home Page Reached");
//     let keysWillBeSendPromises = currPage.type(
//       "input[type='text']",
//       "__sonu_2.0"
//     );
//     return keysWillBeSendPromises;
//   })
//   .then(function () {
//     // console.log("Goggle Home Page Reached");
//     let keysWillBeSendPromises = currPage.type(
//       "input[type='password']",
//       "Coders@132"
//     );
//     return keysWillBeSendPromises;
//   })
//   .then(function () {
//     let enetWillBePressedPromise = currPage.keyboard.press("Enter");
//     return enetWillBePressedPromise;
//   })
//   .then(function () {
//     let elementWaitPromise = currPage.waitForSelector('input[placeholder="Search"]', {
//       visible: true,
//     });
//     return elementWaitPromise;
//   })
//   .then(function () {
//     // console.log("Goggle Home Page Reached");
//     let keysWillBeSendPromises = currPage.type('input[placeholder="Search"]', "pepcoding");
//     return keysWillBeSendPromises;
//   }).then(function () {
//     let elementWaitPromise = currPage.waitForSelector(".-qQT3", {
//       visible: true,
//     });
//     return elementWaitPromise;
//   })
//   // .then(function () {
//   //   // console.log("Goggle Home Page Reached");
//   //   let keysWillBeSendPromises = currPage.type(".-qQT3", "pepcoding");
//   //   return keysWillBeSendPromises;
//   // })
//   .then(function(){
//     // let searchEle = currPage.
//     let clickPromise = currPage.click('a.-qQT3');
//     return clickPromise;
//   })
//   .then(function () {
//     let elementWaitPromise = currPage.waitForSelector(".nZSzR>h2", {
//       visible: true,
//     });
//     return elementWaitPromise;
//   }).then(function(){
//     let postEle = currPage.evaluate(function(){return document.querySelector('.nZSzR>h2').innerText});
//     console.log(postEle.length);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
// console.log("after");

(async () => {
  try {
    let browserOpenPromises = await puppeteer.launch({
      headless: false,
      slowMo: true,
      defaultViewport: null,
      args: ["--start-fullscreen"],
    });
    let pages = await browserOpenPromises.pages();
    currPage = pages[0];
    await currPage.goto("https://www.instagram.com");
    await currPage.waitForSelector("input[type='text']");
    await currPage.type(
            "input[type='text']",
            // "__sonu_2.0"
            "ri.shabh8122"
          );
    await currPage.type(
            "input[type='password']",
            // "Coders@132"
            "rishabh@325"
          );
    await currPage.keyboard.press("Enter");
    await currPage.waitForSelector('input[placeholder="Search"]', {
            visible: true,
          });
    await currPage.type('input[placeholder="Search"]', "pepcoding");
    await currPage.waitForSelector(".-qQT3", {
            visible: true,
          });
    await currPage.click('a.-qQT3');
    await currPage.waitForSelector('span.g47SY');
    let totalVideos = await currPage.evaluate(()=>{return document.querySelector('span.g47SY').innerText});
    console.log(totalVideos);
    await currPage.waitForSelector(".v1Nh3.kIKUG._bz0w>a",{delay:3000});
    let currVideos = await getCurrVideosLen();
        // console.log(currVideos);
        while(totalVideos >= 550){
          totalVideos=totalVideos - currVideos;
          await scrollToBottom();
          // console.log(currVideos);
            currVideos = await getCurrVideosLen();
        }
        // await currPage.waitForSelector("img.FFVAD",{delay:3000});
        let listOfVideos = await getStates();
        console.log(listOfVideos);
        for(let i =0 ;i<listOfVideos.length;i++){
          await currPage.click(listOfVideos[i]);
        }
        
        
  } catch (error) {
    console.log(error)
  }
})()

async function getCurrVideosLen(){
  let length = await currPage.evaluate(getLength,'.v1Nh3.kIKUG._bz0w>a');
  return length;
}

function getLength(selector){
  let videosInCurrPage = document.querySelectorAll(selector);
  return videosInCurrPage.length;
}

async function scrollToBottom(){
  await currPage.evaluate(gotoBottom);
  function gotoBottom(){
      window.scrollBy(0,window.innerHeight);
  }
}
 async function getStates(){
  //'div#meta h3 a[href]'
  //, 'span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer'
  
  let details = await currPage.evaluate(getDetailsVideo,'.v1Nh3.kIKUG._bz0w>a');
  return details;
}

async function getDetailsVideo(vdoNameSel){
  let currList = [];
  let videoNameArr = document.querySelectorAll(vdoNameSel);
  for(let i = 0; i < videoNameArr.length; i++){
      let videoLink = 'https://www.instagram.com' + videoNameArr[i].getAttribute('href');
      currList.push(videoLink);
      // await currPage.click(videoNameArr[i].getAttribute('href'));
      break;
  }
  return currList;
}